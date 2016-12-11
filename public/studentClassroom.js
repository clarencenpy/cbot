const App = {
  init() {
    this.bindEvents()
  },

  bindEvents() {

    $('#btn-back').on('click', () => {
      location.href = '/main'
    })

    $('.taskCard').on('click', (e) => {
      let $taskCard = $(e.target).closest('.taskCard')
      let id = $taskCard.data('taskid')
      this.loadTask(id)
    })
  },

  loadTask(id) {
    //remove selected class from all taskCards
    $('.taskCard').each((i, e) => {
      $(e).removeClass('selected')
    })
    //add selected class to selected task
    $(`.taskCard[data-taskid="${id}"]`).first().addClass('selected')
  }
}

$(() => {
  App.init()
})