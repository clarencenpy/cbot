const App = {
  init() {
    this.initComponents()
    this.initStudentProgress()
    this.bindEvents()
  },

  initComponents() {
    $('.classAttendanceProgress').progress().progress({
      text: {
        active: '{value} of {total} students joined',
        success: 'Class is full!'
      }
    })
  },

  initStudentProgress() {
    $.getJSON('/classroom/progress', (studentProgressByClassroom) => {
      $.each(studentProgressByClassroom, (classroomId, progress) => {
        let $classroom = $($(`.classroomCard[data-id="${classroomId}"]`)[0])
        let $progress = $classroom.find('.studentProgress')
        $progress.progress({
          text: {
            active: '{value} of {total} tasks completed',
            success: 'All Tasks Complete!'
          }
        })
        $progress.progress('set total', progress.totalTasks)
        $progress.progress('set progress', progress.totalSubmissions)
      })
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
              $('#classroomList').append($classroomCard)
              $classroomCard.find('.classAttendanceProgress').progress({
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

    $('.classroomCard').on('click', (e) => {
      let id = $(e.target).closest('.classroomCard').data('id')
      window.location.href = `/instructor/classroom/${id}`
    })
  },

}

$(() => {
  App.init()
})