const App = {
  init() {
    this.initComponents()
    this.bindEvents()
  },

  initComponents() {

  },

  bindEvents() {
    $('#btn-createClassroom').on('click', () => {
      let $modal = $('#modal-createClassroom')
      $modal.modal({
        onApprove: () => {
          let name = $modal.find('input[name="name"]').val()
          let password = $modal.find('input[name="password"]').val()
          $.ajax({
            method: 'PUT',
            contentType: 'application/json',
            url: '/classroom',
            data: JSON.stringify({
              name,
              password,
              tasks: [],
              students: []
            })
          })
        }
      }).modal('show')
    })
  }
}

$(() => {
  App.init()
})