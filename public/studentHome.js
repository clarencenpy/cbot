const App = {
  init() {
    this.userId = $('body').data('userid')
    this.initStudentProgress()
    this.bindEvents()
    this.bindSocketEvents()
  },

  bindSocketEvents() {
    this.socket = io()
    this.socket.on('receivedAssignment', data => {
      if (data.sourceStudent.id === this.userId || data.targetStudent.id === this.userId) {
        let $modal = $('#modal-assign')

        if (this.userId === data.sourceStudent.id) {
          $modal.find('img').attr('src', data.targetStudent.displayPhoto)
          $modal.find('h4').html(`You're doing great! You should go help out ${data.targetStudent.firstName} with the tasks!`)
        } else {
          $modal.find('img').attr('src', data.sourceStudent.displayPhoto)
          $modal.find('h4').html(`${data.sourceStudent.firstName} will be coming over soon to help you out!`)
        }

        $modal.modal('show')
      }
    })
  },

  initStudentProgress() {
    $.getJSON('/classroom/progress', (studentProgressByClassroom) => {
      $.each(studentProgressByClassroom, (classroomId, progress) => {
        let $classroom = $(`.classroomCard[data-id="${classroomId}"]`).first()
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

    $('#classrooms').on('click', '.classroomCard', (e) => {
      let $classroomCard = $(e.target).closest('.classroomCard')
      let id = $classroomCard.data('id')

      //enter the class
      $.ajax({
        url: `/enterClassroom/${id}`,
        method: 'POST'
      })

      window.location.href = `/student/classroom/${id}`
    })
  },

}

$(() => {
  App.init()
})