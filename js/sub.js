/* =====================================================
   SUB PAGE JS — sub.js
   ===================================================== */

/* ── 이전글 / 다음글 설정 ──
   새 웹진 발행 시 TOTAL_ARTICLES 값만 변경하면 됩니다. */
const TOTAL_ARTICLES = 17;

$(document).ready(function () {
  /* ── 이전글 / 다음글 네비게이션 ── */
  (function buildArticleNav() {
    // 현재 파일명에서 번호 추출 (예: sub3.html → 3)
    const match = window.location.pathname.match(/sub(\d+)\.html/i);
    if (!match) return;

    const current = parseInt(match[1], 10);
    const prevNum = current === 1 ? TOTAL_ARTICLES : current - 1;
    const nextNum = current === TOTAL_ARTICLES ? 1 : current + 1;

    const prevHref = "sub" + prevNum + ".html";
    const nextHref = "sub" + nextNum + ".html";

    const navHtml =
      '<nav class="article-pager" aria-label="이전글 다음글">' +
      '<a href="' +
      prevHref +
      '" class="pager-btn pager-prev">' +
      '<span class="pager-arrow">&#8592;</span>' +
      '<span class="pager-label">이전글</span>' +
      "</a>" +
      '<a href="../index.html" class="pager-btn pager-home" aria-label="목록으로">' +
      '<span class="pager-home-icon">&#9783;</span>' +
      "</a>" +
      '<a href="' +
      nextHref +
      '" class="pager-btn pager-next">' +
      '<span class="pager-label">다음글</span>' +
      '<span class="pager-arrow">&#8594;</span>' +
      "</a>" +
      "</nav>";

    $("#site-footer").before(navHtml);
  })();

  /* ── 글자 크기 조절 (단위: rem / 1rem = 16px 기준, 0.0625rem = 1px) ── */
  let baseFontSize = 1; // 기본 1rem (16px)

  $(document).on("click", ".ctrl-font-sm", function () {
    baseFontSize = Math.max(0.8125, +(baseFontSize - 0.0625).toFixed(4));
    applyFontSize(baseFontSize);
  });

  $(document).on("click", ".ctrl-font-lg", function () {
    baseFontSize = Math.min(1.25, +(baseFontSize + 0.0625).toFixed(4));
    applyFontSize(baseFontSize);
  });

  function applyFontSize(size) {
    $(".article-section-body p").css("font-size", size + "rem");
    $(".article-section-body li").css("font-size", size + "rem");
    $(".article-lead p").css("font-size", size - 0.0625 + "rem");
    $(".essay-frame-body p").css("font-size", size + "rem");
  }

  /* ── 모바일 사이드바 드롭다운 토글 버튼 삽입 ── */
  const $quickNav = $("#article-sidebar .quick-nav");
  if ($quickNav.length) {
    $quickNav.before(
      '<button class="qnav-toggle" aria-expanded="false">' +
        '<span class="qnav-toggle-label">목차</span>' +
        '<span class="qnav-toggle-icon">▾</span>' +
        "</button>"
    );
  }

  function closeQuickNav() {
    $quickNav.removeClass("open");
    $(".qnav-toggle")
      .attr("aria-expanded", "false")
      .find(".qnav-toggle-icon")
      .text("▾");
  }

  $(document).on("click", ".qnav-toggle", function () {
    const isOpen = $quickNav.hasClass("open");
    if (isOpen) {
      closeQuickNav();
    } else {
      $quickNav.addClass("open");
      $(this).attr("aria-expanded", "true").find(".qnav-toggle-icon").text("▴");
    }
  });

  /* ── 빠른 이동 클릭 → 스무스 스크롤 + 드롭다운 닫기 ── */
  $(document).on("click", ".qnav-link", function (e) {
    e.preventDefault();
    const targetId = $(this).attr("href");
    const $target = $(targetId);
    if ($target.length) {
      const offset = $target.offset().top - 84;
      $("html, body").animate({ scrollTop: offset }, 600, "swing");
    }
    closeQuickNav();
  });

  /* ── 스크롤 위치에 따라 사이드바 활성 항목 갱신 ── */
  const sectionIds = [
    "sec-lead",
    "section1",
    "section2",
    "section3",
    "section4",
    "section5",
    "section6",
  ];

  function updateActiveNav() {
    const scrollTop = $(window).scrollTop() + 100;
    let current = sectionIds[0];

    sectionIds.forEach(function (id) {
      const $el = $("#" + id);
      if ($el.length && $el.offset().top <= scrollTop) {
        current = id;
      }
    });

    $(".qnav-link").removeClass("active");
    $('.qnav-link[href="#' + current + '"]').addClass("active");
  }

  $(window).on("scroll", updateActiveNav);
  updateActiveNav();

  /* ── article-quote 형광펜 애니메이션 (IntersectionObserver) ── */
  if ("IntersectionObserver" in window) {
    const quoteObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("highlight-on");
          } else {
            entry.target.classList.remove("highlight-on");
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll(".highlighter").forEach(function (el) {
      quoteObserver.observe(el);
    });
  }
});
