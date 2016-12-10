const App = {
  init() {
    this.classroomId = $('body').data('classroomid')
    this.initComponents()
    this.bindEvents()
  },

  initComponents() {
    $('.ui.accordion').accordion();
  },

  bindEvents() {
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
              $('#taskList').append($taskCard)
              $('#taskList').accordion('refresh')
              $taskCard.find('.progress').progress({
                text: {
                  active: '{value} of {total} students joined',
                  success: 'Class is full!'
                }
              }).progress('update progress')
            }
          })
        }
      }).modal('show')
    })
  }
}

$(() => {
  App.init()
})