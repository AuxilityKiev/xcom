import banner from "./controller";
import auth from "../auth/controller";

export default {
  init: function(router) {
    router.get("/admin-api/banner/public", banner.getPublicBanners),
      router.get("/admin-api/banner/:id", auth.userGuard, banner.getBanner),
      router.get("/admin-api/banner", auth.userGuard, banner.getBanners),
      router.post("/admin-api/banner", auth.userGuard, banner.createBanner),
      router.post(
        "/admin-api/banner/:id/image",
        auth.userGuard,
        banner.uploadImage
      ),
      router.put("/admin-api/banner/:id", auth.userGuard, banner.updateBanner),
      router.delete(
        "/admin-api/banner/:id",
        auth.userGuard,
        banner.deleteBanner
      );
  }
};
