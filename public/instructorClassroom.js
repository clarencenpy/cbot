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
      console.log(data)
      $.get(`/studentCard/${data.studentId}`, html => {
        $('#studentList').append(html)
      })
      $('.studentCard .image').dimmer({on: 'hover'})
      this.updateProgress()
    })

    this.socket.on('leaveClassroom', data => {
      $(`.studentCard[data-studentid="${data.studentId}"]`).first().remove()
      this.updateProgress()
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
          let points = Number($modal.find('input[name="points"]').val())
          $.ajax({
            method: 'PUT',
            contentType: 'application/json',
            url: `/classroom/${this.classroomId}/task`,
            data: JSON.stringify({
              name,
              description,
              points
            }),
            success: (taskHtml) => {
              let $taskCard = $(taskHtml)
              $('#taskList').append($taskCard).accordion('refresh')
            }
          })

          this.updateProgress()
        }
      }).modal('show')
    })
  }
}

$(() => {
  App.init()
})