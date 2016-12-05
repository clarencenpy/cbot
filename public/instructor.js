const App = {
  init() {
    this.initComponents()
    this.bindEvents()
  },

  initComponents() {
    $('.progress').progress({
      text: {
        active: '{value} of {total} students joined',
        success: 'Class is full!'
      }
    }).progress('update progress')
  },

  refresh() {
    $('.progress').progress('update progress')
  },

  bindEvents() {
    $('#btn-createClassroom').on('click', () => {
      let $modal = $('#modal-createClassroom')
      $modal.modal({
        onApprove: () => {
          let name = $modal.find('input[name="name"]').val()
          let password = $modal.find('input[name="password"]').val()
          let expectedAttendance = Number($modal.find('input[name="expectedAttendance"]').val())
          $.ajax({
            method: 'PUT',
            contentType: 'application/json',
            url: '/classroom',
            data: JSON.stringify({
              name,
              password,
              expectedAttendance,
              tasks: [],
              students: []
            }),
            success: (classroomHtml) => {
              $('#classroomList').append(classroomHtml)
            }
          })
        }
      }).modal('show')
    })
  },

}

$(() => {
  App.init()
})