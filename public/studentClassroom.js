const App = {
  init() {
    this.classroomId = $('body').data('classroomid')
    this.initComponents()
    this.bindEvents()
    this.bindSocketEvents()
  },

  initComponents() {
    $('.ui.accordion').accordion();
    this.codepadHtml = ace.edit('codepadHtml')
    this.codepadHtml.getSession().setMode('ace/mode/html')
    this.codepadHtml.setOption('showPrintMargin', false)

    this.codepadJs = ace.edit('codepadJs')
    this.codepadJs.getSession().setMode('ace/mode/javascript')
    this.codepadJs.setOption('showPrintMargin', false)

    $('.fullscreen.modal').modal()
  },

  loadIFrame(html, js) {
    let output = html
    output += `\n<script src="//code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>\n`
    output += `<script>${js}</script>`

    let iframe = $('#iframe')[0]
    iframe.contentWindow.document.open()
    iframe.contentWindow.document.write(output)
    iframe.contentWindow.document.close()
  },

  bindSocketEvents() {
    this.socket = io()
    this.socket.on('newTask', data => {
      if (data.classroomId === this.classroomId) {
        $.get(`/taskCard/${data.taskId}`, html => {
          $('#taskEmptyNotice').remove()
          $('#taskList').append(html).accordion('refresh')
          this.updateProgress()
        })
      }
    })
  },

  bindEvents() {

    $('#btn-back').on('click', () => {
      location.href = '/main'
    })

    $('#tasks').on('click', '.taskCard', (e) => {
      let $taskCard = $(e.target).closest('.taskCard')
      let id = $taskCard.data('taskid')
      this.currentTaskId = id
      this.selectTask(id)
    })

    $('#btn-run').on('click', () => {
      this.loadIFrame(this.codepadHtml.getValue(), this.codepadJs.getValue())
      $('.fullscreen.modal').modal('show')
    })

    $('#btn-submit').on('click', () => {
      $(`#btn-submit`).addClass('loading')
      let minimumTimeLoaded = false
      let ajaxReturned = false

      let htmlCode = this.codepadHtml.getValue()
      let jsCode = this.codepadJs.getValue()

      $.ajax({
        method: 'PUT',
        contentType: 'application/json',
        url: `/submission/${this.currentTaskId}`,
        data: JSON.stringify({
          htmlCode,
          jsCode
        }),
        success: () => {
          ajaxReturned = true
          if (minimumTimeLoaded) {
            $(`.taskCard[data-taskid="${this.currentTaskId}"]`).find('.status-container').first()
            .html(`<div class="ui green label status"><i class="check icon"></i>Done</div>`)
            $(`#btn-submit`).removeClass('loading')
          }
        }
      })

      setTimeout(() => {
        minimumTimeLoaded = true
        if (ajaxReturned) {
          $(`.taskCard[data-taskid="${this.currentTaskId}"]`).find('.status-container').first()
          .html(`<div class="ui green label status"><i class="check icon"></i>Done</div>`)
          $(`#btn-submit`).removeClass('loading')
        }
      }, 1000)
    })

    $('#btn-leave').on('click', () => {
      let classroomId = $('body').data('classroomid')
      $.ajax({
        url: `/leaveClassroom/${classroomId}`,
        method: 'POST'
      })
      location.href = '/main'
    })
  },

  selectTask(id) {
    //try to load submission if present, or the boilerplate code
    $.getJSON(`/boilerplate/${id}`, boilerplate => {
      this.codepadHtml.setValue(boilerplate.htmlCode)
      this.codepadJs.setValue(boilerplate.jsCode)
    })

    //load task description
    $('.taskCard').each((i, e) => {
      $(e).removeClass('current')
    })
    $(`.taskCard[data-taskid="${id}"]`).first().addClass('current')

  }
}

$(() => {
  App.init()
})