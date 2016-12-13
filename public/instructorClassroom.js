const App = {
  init() {
    this.classroomId = $('body').data('classroomid')
    this.initComponents()
    this.bindEvents()
    this.bindSocketEvents()
  },

  initComponents() {
    $('.ui.accordion').accordion();
    $('.studentCard .image').dimmer({on: 'hover'})
    this.updateProgress()
    this.codepadHtmlBoilerplate = ace.edit('codepadHtmlBoilerplate')
    this.codepadHtmlBoilerplate.getSession().setMode('ace/mode/html')
    this.codepadHtmlBoilerplate.setOption('showPrintMargin', false)

    this.codepadJsBoilerplate = ace.edit('codepadJsBoilerplate')
    this.codepadJsBoilerplate.getSession().setMode('ace/mode/javascript')
    this.codepadJsBoilerplate.setOption('showPrintMargin', false)
  },

  updateProgress() {
    $.getJSON(`/classroom/${this.classroomId}/progress`, (report) => {
      //update all progress bars on tasks
      $('.taskCard').each((i, elem) => {
        const $elem = $(elem)
        let taskId = $elem.data('taskid')
        $elem.find('.progress')
        .progress('set total', report.totalStudents)
        .progress('set progress', report.taskReport[taskId].length)
      })

      //update all progress bars on students
      $('.studentCard').each((i, elem) => {
        const $elem = $(elem)
        let studentId = $elem.data('studentid')
        $elem.find('.progress')
        .progress('set total', report.totalTasks)
        .progress('set progress', report.studentReport[studentId].length)
      })
    })
  },

  bindSocketEvents() {
    this.socket = io()
    this.socket.on('enterClassroom', data => {
      if (data.classroomId === this.classroomId) {
        $.get(`/studentCard/${data.studentId}`, html => {
          $('#studentEmptyNotice').remove()
          $('#studentList').append(html)
          $('.studentCard .image').dimmer({on: 'hover'})
          this.updateProgress()
        })
      }
    })

    this.socket.on('leaveClassroom', data => {
      $(`.studentCard[data-studentid="${data.studentId}"]`).first().remove()
      this.updateProgress()
    })

    this.socket.on('submissionReceived', data => {
      if (data.classroomId === this.classroomId) {
        this.updateProgress()
      }
    })
  },

  bindEvents() {
    $('#btn-back').on('click', () => {
      location.href = '/main'
    })
    $('#btn-createTask').on('click', () => {
      let $modal = $('#modal-createTask')
      $modal.modal({
        onApprove: () => {
          let name = $modal.find('input[name="name"]').val()
          let description = $modal.find('textarea[name="description"]').val()
          let htmlCode = this.codepadHtmlBoilerplate.getValue()
          let jsCode = this.codepadJsBoilerplate.getValue()
          $.ajax({
            method: 'PUT',
            contentType: 'application/json',
            url: `/classroom/${this.classroomId}/task`,
            data: JSON.stringify({
              name,
              description,
              htmlCode,
              jsCode
            }),
            success: (taskHtml) => {
              let $taskCard = $(taskHtml)
              $('#taskEmptyNotice').remove()
              $('#taskList').append($taskCard).accordion('refresh')
              this.updateProgress()
            }
          })

        }
      }).modal('show')
    })

    $('#students').on('click', '.btn-viewer', (e) => {
      if (this.assignMode) return
      let $studentCard = $(e.target).closest('.studentCard')
      let studentId = $studentCard.data('studentid')
      window.location.href = `/instructor/viewer/${this.classroomId}/${studentId}`
    })

    $('#students').on('click', '.btn-assign', (e) => {
      if (this.assignMode) return
      let $studentCard = $(e.target).closest('.studentCard')
      this.sourceStudentId = $studentCard.data('studentid')
      setTimeout(() => {
        this.assignMode = true
      }, 300)
      $('body').addClass('assignMode')
    })

    $('#students').on('click', '.studentCard', (e) => {
      if (!this.assignMode) return //only works in assign mode
      let $studentCard = $(e.target).closest('.studentCard')
      let targetStudentId = $studentCard.data('studentid')
      this.socket.emit('assign', {sourceStudentId: this.sourceStudentId, targetStudentId})
      this.assignMode = false
      $('body').removeClass('assignMode')
    })
  }

}

$(() => {
  App.init()
})