/**
 * Main
 */

"use strict";

let isRtl = window.Helpers.isRtl(),
  isDarkStyle = window.Helpers.isDarkStyle(),
  menu,
  animate,
  isHorizontalLayout = false;

if (document.getElementById("layout-menu")) {
  isHorizontalLayout = document.getElementById("layout-menu").classList.contains("menu-horizontal");
}

(function () {
  if (typeof Waves !== "undefined") {
    Waves.init();
    Waves.attach(".btn[class*='btn-']:not([class*='btn-outline-']):not([class*='btn-label-'])", ["waves-light"]);
    Waves.attach("[class*='btn-outline-']");
    Waves.attach("[class*='btn-label-']");
    Waves.attach(".pagination .page-item .page-link");
  }

  // Initialize menu
  //-----------------

  let layoutMenuEl = document.querySelectorAll("#layout-menu");
  layoutMenuEl.forEach(function (element) {
    menu = new Menu(element, {
      orientation: isHorizontalLayout ? "horizontal" : "vertical",
      closeChildren: isHorizontalLayout ? true : false,
      // ? This option only works with Horizontal menu
      showDropdownOnHover: localStorage.getItem("templateCustomizer-" + templateName + "--ShowDropdownOnHover") // If value(showDropdownOnHover) is set in local storage
        ? localStorage.getItem("templateCustomizer-" + templateName + "--ShowDropdownOnHover") === "true" // Use the local storage value
        : window.templateCustomizer !== undefined // If value is set in config.js
        ? window.templateCustomizer.settings.defaultShowDropdownOnHover // Use the config.js value
        : true, // Use this if you are not using the config.js and want to set value directly from here
    });
    // Change parameter to true if you want scroll animation
    window.Helpers.scrollToActive((animate = false));
    window.Helpers.mainMenu = menu;
  });

  // Initialize menu togglers and bind click on each
  let menuToggler = document.querySelectorAll(".layout-menu-toggle");
  menuToggler.forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      window.Helpers.toggleCollapsed();
      // Enable menu state with local storage support if enableMenuLocalStorage = true from config.js
      if (config.enableMenuLocalStorage && !window.Helpers.isSmallScreen()) {
        try {
          localStorage.setItem("templateCustomizer-" + templateName + "--LayoutCollapsed", String(window.Helpers.isCollapsed()));
        } catch (e) {}
      }
    });
  });

  // Menu  swipe gesture

  // Detect swipe gesture on the target element and call swipe In
  window.Helpers.swipeIn(".drag-target", function (e) {
    window.Helpers.setCollapsed(false);
  });

  // Detect swipe gesture on the target element and call swipe Out
  window.Helpers.swipeOut("#layout-menu", function (e) {
    if (window.Helpers.isSmallScreen()) window.Helpers.setCollapsed(true);
  });

  // Display in main menu when menu scrolls
  let menuInnerContainer = document.getElementsByClassName("menu-inner"),
    menuInnerShadow = document.getElementsByClassName("menu-inner-shadow")[0];
  if (menuInnerContainer.length > 0 && menuInnerShadow) {
    menuInnerContainer[0].addEventListener("ps-scroll-y", function () {
      if (this.querySelector(".ps__thumb-y").offsetTop) {
        menuInnerShadow.style.display = "block";
      } else {
        menuInnerShadow.style.display = "none";
      }
    });
  }

  // Style Switcher (Light/Dark Mode)
  //---------------------------------

  let styleSwitcherToggleEl = document.querySelector(".style-switcher-toggle");

  if (window.templateCustomizer) {
    if (styleSwitcherToggleEl) {
      // Click handler
      styleSwitcherToggleEl.addEventListener("click", function () {
        if (window.Helpers.isLightStyle()) {
          window.templateCustomizer.setStyle("dark");
          updateSwitcherUI("dark");
        } else {
          window.templateCustomizer.setStyle("light");
          updateSwitcherUI("light");
        }
      });

      // Initial load
      updateSwitcherUI(window.Helpers.isLightStyle() ? "light" : "dark");
    }

    function updateSwitcherUI(mode) {
      const iconEl = styleSwitcherToggleEl.querySelector("i");
      const textEl = styleSwitcherToggleEl.querySelector("[data-i18n]");

      // reset icon
      iconEl.classList.remove("ti-moon-stars", "ti-sun");

      if (mode === "light") {
        iconEl.classList.add("ti-moon-stars");
        textEl.textContent = "Dark Mode";
        textEl.setAttribute("data-i18n", "Dark Mode");

        new bootstrap.Tooltip(styleSwitcherToggleEl, {
          title: "Dark mode",
          fallbackPlacements: ["bottom"],
        });

        switchImage("light");
      } else {
        iconEl.classList.add("ti-sun");
        textEl.textContent = "Light Mode";
        textEl.setAttribute("data-i18n", "Light Mode");

        new bootstrap.Tooltip(styleSwitcherToggleEl, {
          title: "Light mode",
          fallbackPlacements: ["bottom"],
        });

        switchImage("dark");
      }
    }
  } else {
    // Remove style switcher if not supported
    styleSwitcherToggleEl?.parentElement.remove();
  }

  // Update light/dark image based on current style
  function switchImage(style) {
    const switchImagesList = [].slice.call(document.querySelectorAll("[data-app-" + style + "-img]"));
    switchImagesList.map(function (imageEl) {
      const setImage = imageEl.getAttribute("data-app-" + style + "-img");
      imageEl.src = assetsPath + "img/" + setImage; // Using window.assetsPath to get the exact relative path
    });
  }

  // Notification
  // ------------
  const notificationMarkAsReadAll = document.querySelector(".dropdown-notifications-all");
  const notificationMarkAsReadList = document.querySelectorAll(".dropdown-notifications-read");

  // Notification: Mark as all as read
  if (notificationMarkAsReadAll) {
    notificationMarkAsReadAll.addEventListener("click", (event) => {
      notificationMarkAsReadList.forEach((item) => {
        item.closest(".dropdown-notifications-item").classList.add("marked-as-read");
      });
    });
  }
  // Notification: Mark as read/unread onclick of dot
  if (notificationMarkAsReadList) {
    notificationMarkAsReadList.forEach((item) => {
      item.addEventListener("click", (event) => {
        item.closest(".dropdown-notifications-item").classList.toggle("marked-as-read");
      });
    });
  }

  // Notification: Mark as read/unread onclick of dot
  const notificationArchiveMessageList = document.querySelectorAll(".dropdown-notifications-archive");
  notificationArchiveMessageList.forEach((item) => {
    item.addEventListener("click", (event) => {
      item.closest(".dropdown-notifications-item").remove();
    });
  });

  // Init helpers & misc
  // --------------------

  // Init BS Tooltip
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Accordion active class
  const accordionActiveFunction = function (e) {
    if (e.type == "show.bs.collapse" || e.type == "show.bs.collapse") {
      e.target.closest(".accordion-item").classList.add("active");
    } else {
      e.target.closest(".accordion-item").classList.remove("active");
    }
  };

  const accordionTriggerList = [].slice.call(document.querySelectorAll(".accordion"));
  const accordionList = accordionTriggerList.map(function (accordionTriggerEl) {
    accordionTriggerEl.addEventListener("show.bs.collapse", accordionActiveFunction);
    accordionTriggerEl.addEventListener("hide.bs.collapse", accordionActiveFunction);
  });

  // If layout is RTL add .dropdown-menu-end class to .dropdown-menu
  if (isRtl) {
    Helpers._addClass("dropdown-menu-end", document.querySelectorAll("#layout-navbar .dropdown-menu"));
  }

  // Auto update layout based on screen size
  window.Helpers.setAutoUpdate(true);

  // Toggle Password Visibility
  window.Helpers.initPasswordToggle();

  // Speech To Text
  window.Helpers.initSpeechToText();

  // Init PerfectScrollbar in Navbar Dropdown (i.e notification)
  window.Helpers.initNavbarDropdownScrollbar();

  // Manage menu expanded/collapsed with templateCustomizer & local storage
  //------------------------------------------------------------------

  // If current layout is horizontal OR current window screen is small (overlay menu) than return from here
  if (isHorizontalLayout || window.Helpers.isSmallScreen()) {
    return;
  }

  // If current layout is vertical and current window screen is > small

  // Auto update menu collapsed/expanded based on the themeConfig
  if (typeof TemplateCustomizer !== "undefined") {
    if (window.templateCustomizer.settings.defaultMenuCollapsed) {
      window.Helpers.setCollapsed(true, false);
    }
  }

  // Manage menu expanded/collapsed state with local storage support If enableMenuLocalStorage = true in config.js
  if (typeof config !== "undefined") {
    if (config.enableMenuLocalStorage) {
      try {
        if (localStorage.getItem("templateCustomizer-" + templateName + "--LayoutCollapsed") !== null && localStorage.getItem("templateCustomizer-" + templateName + "--LayoutCollapsed") !== "false") window.Helpers.setCollapsed(localStorage.getItem("templateCustomizer-" + templateName + "--LayoutCollapsed") === "true", false);
      } catch (e) {}
    }
  }
})();

// datatable Initialization

$(document).ready(function () {
  $("#example").DataTable({
    dom: "Bfrtip",
    buttons: ["copy", "excel", "pdf", "print"],
    paging: false,
    searching: false,
    ordering: false,
  });
});

$(document).ready(function () {
  $("#example-1").DataTable({
    dom: "Bfrtip",
    buttons: ["copy", "excel", "pdf", "print"],
    paging: false,
    searching: false,
    ordering: false,
  });
});
$(document).ready(function () {
  $("#example-2").DataTable({
    dom: "Bfrtip",
    buttons: ["copy", "excel", "pdf", "print"],
    paging: false,
    searching: false,
    ordering: false,
  });
});

// Date Range Picker Initialization
$(function () {
  $('input[name="datetimes"]').daterangepicker({
    timePicker: true,
    startDate: moment().startOf("hour"),
    endDate: moment().startOf("hour").add(32, "hour"),
    locale: {
      format: "M/DD hh:mm A",
    },
  });
});

$(function () {
  $('input[name="birthday"]').daterangepicker({
    singleDatePicker: true,
    showDropdowns: true,
    minYear: 1901,
    maxYear: parseInt(moment().format("YYYY"), 10),
  });
});

$(function () {
  var start = moment().subtract(29, "days").startOf("day");
  var end = moment().endOf("day");

  function cb(start, end) {
    const picker = $("#reportrange").data("daterangepicker");

    if (picker.chosenLabel === "Custom Range") {
      $("#reportrange span").html(start.format("MMM D,  hh:mm A") + " - " + end.format("MMM D,  hh:mm A"));
    } else {
      $("#reportrange span").html(start.format("MMM D ") + " - " + end.format("MMM D "));
    }
  }

  $("#reportrange").daterangepicker(
    {
      startDate: start,
      endDate: end,
      timePicker: true,
      timePickerIncrement: 5,
      locale: {
        format: "MMMM D, YYYY",
        customRangeLabel: "Custom Range",
      },
      ranges: {
        Today: [moment().startOf("day"), moment().endOf("day")],
        Yesterday: [moment().subtract(1, "days").startOf("day"), moment().subtract(1, "days").endOf("day")],
        "Last 7 Days": [moment().subtract(6, "days").startOf("day"), moment().endOf("day")],
        "Last 30 Days": [moment().subtract(29, "days").startOf("day"), moment().endOf("day")],
        "This Month": [moment().startOf("month"), moment().endOf("month")],
        "Last Month": [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")],
      },
    },
    cb
  );
  $("#reportrange").on("click.daterangepicker", function (ev, picker) {
    if (picker.chosenLabel === "Custom Range") {
      picker.timePicker = true;
      picker.locale.format = "MMMM D, YYYY HH:mm";
    } else {
      picker.timePicker = false;
      picker.locale.format = "MMMM D, YYYY";
    }

    picker.updateView();
    picker.updateCalendars();
  });
  cb(start, end);
});

// select2 Initialization

$(document).ready(function () {
  $(".js-example-basic-single").select2();
});

$(document).ready(function () {
  $(".js-example-basic-multiple").select2();
});

// pdf dawnload function
document.getElementById("downloadPdf").addEventListener("click", function () {
  const { jsPDF } = window.jspdf;
  const dashboard = document.getElementById("dashboard");

  html2canvas(dashboard, {
    scale: 2, // better quality
    useCORS: true, // important for charts & images
  }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save("dashboard-report.pdf");
  });
});
