const App = {
  init() {
    this.initComponents()
    this.bindEvents()
    this.bindSocketEvents()
  },

  initComponents() {
    $('.classAttendanceProgress').each((i, e) => {
      let $progress = $(e)
      $progress.progress({
        text: {
          active: '{value} of {total} students joined',
          success: 'Class is full!'
        }
      }).progress('set total', $progress.data('total'))
      .progress('set progress', $progress.data('value'))
    })
  },

  bindSocketEvents() {
    this.socket = io()
    this.socket.on('enterClassroom', data => {
      $(`.classroomCard[data-id="${data.classroomId}"]`).find('.progress').progress('increment')
    })
    this.socket.on('leaveClassroom', data => {
      $(`.classroomCard[data-id="${data.classroomId}"]`).find('.progress').progress('decrement')
    })
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
              let $classroomCard = $(classroomHtml)
              $('#classroomEmptyNotice').remove()
              $('#classroomList').append($classroomCard)
              let $progress = $classroomCard.find('.classAttendanceProgress')
              $progress.progress({
                text: {
                  active: '{value} of {total} students joined',
                  success: 'Class is full!'
                }
              }).progress('set total', $progress.data('total'))
              .progress('set progress', $progress.data('value'))
            }
          })
        }
      }).modal('show')
    })

    $('#classrooms').on('click', '.classroomCard', (e) => {
      let $classroomCard = $(e.target).closest('.classroomCard')
      let id = $classroomCard.data('id')
      window.location.href = `/instructor/classroom/${id}`
    })
  },

}

$(() => {
  App.init()
})