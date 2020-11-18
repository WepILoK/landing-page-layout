$(document).ready(function() {
    $(".burger").click(function(event) {
        $(".burger,.list").toggleClass("active");
        $("body").toggleClass("lock");
    })
})

let anchors = document.querySelectorAll('header a[href*="#"]');

for (anchor of anchors) {
  if (anchor) {
    anchor.addEventListener('click', function(e){
      e.preventDefault();
      anchorId = this.getAttribute('href');
      document.querySelector(anchorId).scrollIntoView({
        behavior: 'smooth', block: 'start'
      })
    })
  }
}