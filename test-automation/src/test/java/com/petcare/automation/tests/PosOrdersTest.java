package com.petcare.automation.tests;

import com.petcare.automation.base.BaseTest;
import com.petcare.automation.config.FrameworkConstants;
import com.petcare.automation.pages.LoginPage;
import com.petcare.automation.pages.PosOrdersPage;
import com.petcare.automation.pages.SidebarNav;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class PosOrdersTest extends BaseTest {

    private LoginPage loginPage;
    private SidebarNav sidebarNav;
    private PosOrdersPage posOrdersPage;

    @BeforeMethod
    public void setupTest() {
        loginPage = new LoginPage(driver);
        sidebarNav = new SidebarNav(driver);
        posOrdersPage = new PosOrdersPage(driver);
        driver.get(FrameworkConstants.APP_URL);

        if (loginPage.isLoginPageDisplayed()) {
            loginPage.clickQuickLoginAdmin();
        }
    }

    @Test(priority = 1, description = "TC_POS_01: Kiểm tra danh sách hóa đơn đơn hàng bán tại quầy")
    public void testViewOrdersList() {
        log("Điều hướng tới module Bán hàng (POS)");
        sidebarNav.goToOrders();

        log("Kiểm tra tiêu đề trang Đơn hàng & POS");
        Assert.assertTrue(posOrdersPage.isPageDisplayed(), "Trang Bán hàng (POS) chưa hiển thị!");

        log("Kiểm tra danh sách đơn hàng có dữ liệu");
        int count = posOrdersPage.getOrdersCount();
        Assert.assertTrue(count > 0, "Danh sách đơn hàng rỗng!");
    }

    @Test(priority = 2, description = "TC_POS_02: Tạo đơn bán hàng POS tại quầy, chọn sản phẩm và xuất hóa đơn")
    public void testCreatePosOrderAndPrintInvoice() {
        log("Điều hướng tới module Bán hàng (POS)");
        sidebarNav.goToOrders();

        int initialCount = posOrdersPage.getOrdersCount();

        log("Mở Drawer Bán Hàng Mới (POS)");
        posOrdersPage.openPosModal();

        log("Thêm sản phẩm vào giỏ hàng POS");
        posOrdersPage.addFirstProductToCart();

        log("Thêm dịch vụ spa vào giỏ hàng POS");
        posOrdersPage.addFirstServiceToCart();

        log("Bấm Thanh Toán & Xuất Hóa Đơn");
        posOrdersPage.completeCheckout();

        log("Xem hóa đơn của đơn hàng vừa tạo");
        posOrdersPage.viewFirstOrderInvoice();

        log("Kiểm tra hiển thị Drawer Hóa Đơn (Invoice) thanh toán");
        Assert.assertTrue(posOrdersPage.isInvoiceDisplayed(), "Hóa đơn thanh toán không hiển thị!");
    }
}
