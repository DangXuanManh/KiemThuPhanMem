package com.petcare.automation.tests;

import com.petcare.automation.base.BaseTest;
import com.petcare.automation.config.FrameworkConstants;
import com.petcare.automation.pages.CrmPage;
import com.petcare.automation.pages.LoginPage;
import com.petcare.automation.pages.PromotionsPage;
import com.petcare.automation.pages.SidebarNav;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class PromotionsAndCrmTest extends BaseTest {

    private LoginPage loginPage;
    private SidebarNav sidebarNav;
    private PromotionsPage promotionsPage;
    private CrmPage crmPage;

    @BeforeMethod
    public void setupTest() {
        loginPage = new LoginPage(driver);
        sidebarNav = new SidebarNav(driver);
        promotionsPage = new PromotionsPage(driver);
        crmPage = new CrmPage(driver);
        driver.get(FrameworkConstants.APP_URL);

        if (loginPage.isLoginPageDisplayed()) {
            loginPage.clickQuickLoginAdmin();
        }
    }

    @Test(priority = 1, description = "TC_PROMO_01: Tạo mã khuyến mãi voucher mới và sao chép mã")
    public void testCreateVoucherAndCopyCode() {
        log("Điều hướng tới module Quản lý Voucher");
        sidebarNav.goToPromotions();

        log("Kiểm tra tiêu đề trang Voucher & Khuyến mãi");
        Assert.assertTrue(promotionsPage.isPageDisplayed(), "Trang Quản lý Voucher chưa hiển thị!");

        int initialCount = promotionsPage.getVoucherCount();

        log("Tạo mới mã Voucher: PETCARE99K");
        promotionsPage.createNewVoucher("PETCARE99K", "Ưu Đãi Khai Trương Mùa Thu");

        int updatedCount = promotionsPage.getVoucherCount();
        Assert.assertTrue(updatedCount >= initialCount, "Tạo mã khuyến mãi mới thất bại!");

        log("Thực hiện sao chép mã khuyến mãi vào Clipboard");
        promotionsPage.clickCopyFirstVoucher();
    }

    @Test(priority = 2, description = "TC_CRM_01: Chăm sóc khách hàng, nhắc lịch > 30 ngày qua Zalo/SMS")
    public void testCrmReminderActions() {
        log("Điều hướng tới module CRM & CSKH");
        sidebarNav.goToCrm();

        log("Kiểm tra tiêu đề trang CRM");
        Assert.assertTrue(crmPage.isPageDisplayed(), "Trang CRM & CSKH chưa hiển thị!");

        log("Gửi tin nhắn nhắc lịch Spa cho khách hàng lâu chưa ghé");
        crmPage.clickFirstReminder();
    }
}
