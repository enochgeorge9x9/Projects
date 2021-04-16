let controller = new ScrollMagic.Controller(); //Add scenes/animation to any element
let timeline = new TimelineMax(); //Chain together multiple animations

//Example with Text and image
// timeline
// .to(".text", 2, { x: 500 })
// .to(".content-images", 2, {opacity: 0}, "-=2")
// .to(".content-images", 5, {opacity: 100})

// timeline
// .fromTo('.text', {opacity: 0}, {opacity: 1, duration: 5})


timeline
    .to(".rock", 3, {y: -300})
    .to(".lady", 3, {y:-200}, "-=3")
    .fromTo(".bg1", 3, {y: -30}, {y:0, duration: 3}, "-=3")
    .to(".content", 3, {top:"0%"}, '-=3')
    .fromTo('.content-images', {opacity:0}, {opacity: 1, duration: 3})
    .fromTo('.text', {opacity:0}, {opacity: 1, duration: 3})

let scene = new ScrollMagic.Scene({
    triggerElement: 'section',
    duration: "150%",
    triggerHook:0, 
})
.setTween(timeline)
.setPin('section')
.addTo(controller)