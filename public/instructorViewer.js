const App = {
  init() {
    this.classroomId = $('body').data('classroomid')
    this.studentId = $('body').data('studentid')
    this.initComponents()
    this.bindEvents()
  },

  initComponents() {
    $('.ui.accordion').accordion();
    $('.studentCard .image').dimmer({on: 'hover'})
    this.codepadHtml = ace.edit('codepadHtml')
    this.codepadHtml.getSession().setMode('ace/mode/html')
    this.codepadHtml.setOption('showPrintMargin', false)
    this.codepadHtml.setReadOnly(true)

    this.codepadJs = ace.edit('codepadJs')
    this.codepadJs.getSession().setMode('ace/mode/javascript')
    this.codepadJs.setOption('showPrintMargin', false)
    this.codepadJs.setReadOnly(true)

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

  bindEvents() {
    $('#btn-back').on('click', () => {
      location.href = `/instructor/classroom/${this.classroomId}`
    })

    $('#btn-run').on('click', () => {
      this.loadIFrame(this.codepadHtml.getValue(), this.codepadJs.getValue())
      $('.fullscreen.modal').modal('show')
    })

    $('#tasks').on('click', '.taskCard', (e) => {
      let $taskCard = $(e.target).closest('.taskCard')
      let taskId = $taskCard.data('taskid')
      this.currentTaskId = taskId
      this.selectTask(taskId)
    })

  },

  selectTask(taskId) {
    //try to load submission if present
    $.ajax({
      url: `/submission/${this.studentId}/${taskId}/`,
      method: 'GET',
      success: (submission) => {
        this.codepadHtml.setValue(submission.htmlCode)
        this.codepadJs.setValue(submission.jsCode)
      },
      error: () => {
        //not found
        this.codepadHtml.setValue('')
        this.codepadJs.setValue('')
      }
    })


    //load task description
    $('.taskCard').each((i, e) => {
      $(e).removeClass('current')
    })
    $(`.taskCard[data-taskid="${taskId}"]`).first().addClass('current')

  }

}

$(() => {
  App.init()
})