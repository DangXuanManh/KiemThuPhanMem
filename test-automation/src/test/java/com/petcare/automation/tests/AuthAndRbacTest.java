package com.petcare.automation.tests;

import com.petcare.automation.base.BaseTest;
import com.petcare.automation.config.FrameworkConstants;
import com.petcare.automation.pages.DashboardPage;
import com.petcare.automation.pages.LoginPage;
import com.petcare.automation.pages.SidebarNav;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class AuthAndRbacTest extends BaseTest {

    private LoginPage loginPage;
    private SidebarNav sidebarNav;
    private DashboardPage dashboardPage;

    @BeforeMethod
    public void setupTest() {
        loginPage = new LoginPage(driver);
        sidebarNav = new SidebarNav(driver);
        dashboardPage = new DashboardPage(driver);
        driver.get(FrameworkConstants.APP_URL);
    }

    @Test(priority = 1, description = "TC_AUTH_01: Đăng nhập nhanh 1-Click với quyền Quản trị viên (Admin)")
    public void testQuickLoginAsAdmin() {
        log("Thực hiện đăng nhập nhanh với quyền Admin");
        if (loginPage.isLoginPageDisplayed()) {
            loginPage.clickQuickLoginAdmin();
        }
        
        log("Kiểm tra đăng nhập thành công vào trang Tổng quan Dashboard");
        Assert.assertTrue(dashboardPage.isPageDisplayed(), "Màn hình Dashboard chưa hiển thị!");
        Assert.assertTrue(sidebarNav.getCurrentRoleText().contains("Quản Trị") || sidebarNav.getCurrentRoleText().contains("Admin"), "Chức vụ không khớp với quyền Admin!");
    }

    @Test(priority = 2, description = "TC_AUTH_02: Đăng nhập Form với tài khoản Nhân viên và kiểm tra phân quyền bảo mật")
    public void testStaffRoleRestrictions() {
        log("Đăng xuất tài khoản hiện tại (nếu có)");
        sidebarNav.logout();

        log("Đăng nhập Form với tài khoản Nhân viên (staff)");
        if (loginPage.isLoginPageDisplayed()) {
            loginPage.loginWithForm("staff", FrameworkConstants.STAFF_EMAIL, FrameworkConstants.STAFF_PASSWORD);
        }

        log("Truy cập thử trang Quản lý Nhân viên (Admin Only)");
        sidebarNav.goToStaff();

        log("Kiểm tra hiển thị cảnh báo chặn truy cập đối với Nhân viên");
        Assert.assertTrue(sidebarNav.isRestrictedNoticeDisplayed(), "Hệ thống chưa chặn nhân viên truy cập module Admin!");
    }

    @Test(priority = 3, description = "TC_AUTH_03: Đăng nhập với vai trò Khách hàng (bị chặn truy cập nội bộ)")
    public void testCustomerLoginBlocked() {
        log("Đăng xuất về màn hình Login");
        sidebarNav.logout();

        log("Chọn vai trò Khách hàng và thử đăng nhập");
        if (loginPage.isLoginPageDisplayed()) {
            loginPage.loginWithForm("customer", "customer@gmail.com", "123456");
            log("Kiểm tra hiển thị thông báo lỗi chặn khách hàng");
            Assert.assertTrue(loginPage.isErrorMessageDisplayed(), "Chưa hiển thị thông báo chặn khách hàng truy cập!");
            Assert.assertTrue(loginPage.getErrorMessage().contains("Khách hàng không có quyền"), "Nội dung thông báo lỗi không đúng!");
        }
    }
}
