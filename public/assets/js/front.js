document.addEventListener("alpine:init", () => {
  Alpine.data("front", () => ({
    showScrollNav: false,
    switchShowScrollNav() {this.showScrollNav = !this.showScrollNav},
    showHiddenAccess: false,
    switchHiddenAccess() {this.showHiddenAccess = !this.showHiddenAccess},
    ShowMobileScrollNav: false,
    switchShowMobileScrollNav() {this.ShowMobileScrollNav = !this.ShowMobileScrollNav},
    IsMobile: screen.width<650
  }));
});