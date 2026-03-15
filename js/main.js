/* ===== LOAD PARTIALS ===== */
$(document).ready(function () {
  const base = $("html").data("base") ?? "";
  const extraScript = $("html").data("script") ?? "";

  // const loadHeader = $.Deferred();
  // const loadFooter = $.Deferred();

  $("#site-header").load(`${base}/_partials/header.html`);
  $("#site-footer").load(`${base}/_partials/footer.html`);

  $.when(loadHeader, loadFooter).done(initUI);

  if (extraScript) {
    $.ajax({
      url: `${base}/js/${extraScript}.js`,
      dataType: "script",
      cache: true,
    });
  }
});

/* ===== UI 초기화 (파셜 로드 완료 후 실행) ===== */
function initUI() {
  /* SCROLL REVEAL */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 },
  );
  document
    .querySelectorAll(".scroll-reveal")
    .forEach((el) => revealObserver.observe(el));

  /* HERO SCROLL BUTTON */
  $(document).on("click", ".hero-scroll-btn", () => {
    $("#sec01")[0].scrollIntoView({ behavior: "smooth" });
  });

  /* TOP BUTTON */
  $(document).on("click", ".top-btn", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* GNB TOGGLE */
  $(document).on("click", ".menu-btn", function () {
    const $btn = $(this);
    const $gnb = $btn.closest("header").find(".gnb");
    const isOpen = $gnb.toggleClass("open").hasClass("open");
    $btn.toggleClass("active", isOpen);
    $btn.attr("aria-expanded", isOpen);
    $gnb.attr("aria-hidden", !isOpen);
  });

  /* GNB LINKS — sub 페이지에서 base 경로 적용 */
  const gnbBase = $("html").data("base") ?? "";
  if (gnbBase) {
    $(".gnb a[href]").each(function () {
      $(this).attr("href", gnbBase + "/" + $(this).attr("href"));
    });
  }

  /* SEC 02 — SLICK CAROUSEL */
  const $slider = $(".sec02-slider");
  if ($slider.length) {
    $slider.slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: false,
      dots: false,
      infinite: true,
      autoplay: true,
      autoplaySpeed: 2000,
      speed: 400,
      responsive: [
        { breakpoint: 1024, settings: { slidesToShow: 2 } },
        { breakpoint: 768, settings: { slidesToShow: 1 } },
      ],
    });

    // 카운터 초기값
    const total = $slider.slick("getSlick").slideCount;
    $(".sec02-counter").text("1/" + total);

    // 커스텀 화살표 버튼 연결
    const $btns = $(".sec02-arrows button");
    $btns.first().on("click", () => $slider.slick("slickPrev"));
    $btns.last().on("click", () => $slider.slick("slickNext"));

    // 슬라이드 변경 시 카운터 업데이트
    $slider.on("afterChange", function (_e, slick, currentSlide) {
      $(".sec02-counter").text(currentSlide + 1 + "/" + slick.slideCount);
    });
  }
}
