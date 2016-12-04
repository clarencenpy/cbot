$(() => {
  $('#typed').typed({
    contentType: 'html',
    strings: [
      'Hello.^1000<br>My name is <strong class="highlight">CBOT</strong>^2000',
      'I help students learn coding<br><strong class="highlight">collaboratively</strong> in class.^2000'
    ],
    loop: true
  })
})