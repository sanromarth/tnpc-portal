const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counter = entry.target;
      const target = +counter.getAttribute("data-target");
      let count = 0;
      const increment = target / 150;

      const update = () => {
        if (count < target) {
          count += increment;
          counter.innerText = Math.ceil(count);
          requestAnimationFrame(update);
        } else {
          counter.innerText = target;
        }
      };

      update();
      counterObserver.unobserve(counter);
    }
  });
});

counters.forEach(counter => {
  counterObserver.observe(counter);
});
