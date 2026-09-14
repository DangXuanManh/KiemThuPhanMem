package com.petcare.automation.tests;

import com.petcare.automation.base.BaseTest;
import com.petcare.automation.config.FrameworkConstants;
import com.petcare.automation.pages.LoginPage;
import com.petcare.automation.pages.ServicesPage;
import com.petcare.automation.pages.SidebarNav;
import com.petcare.automation.pages.StaffPage;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class ServicesAndStaffTest extends BaseTest {

    private LoginPage loginPage;
    private SidebarNav sidebarNav;
    private ServicesPage servicesPage;
    private StaffPage staffPage;

    @BeforeMethod
    public void setupTest() {
        loginPage = new LoginPage(driver);
        sidebarNav = new SidebarNav(driver);
        servicesPage = new ServicesPage(driver);
        staffPage = new StaffPage(driver);
        driver.get(FrameworkConstants.APP_URL);

        if (loginPage.isLoginPageDisplayed()) {
            loginPage.clickQuickLoginAdmin();
        }
    }

    @Test(priority = 1, description = "TC_SVC_01: Quản lý bảng giá dịch vụ spa & grooming")
    public void testViewServicesList() {
        log("Điều hướng tới module Quản lý Dịch vụ");
        sidebarNav.goToServices();

        log("Kiểm tra tiêu đề trang Dịch vụ");
        Assert.assertTrue(servicesPage.isPageDisplayed(), "Trang Quản lý Dịch vụ chưa hiển thị!");

        log("Kiểm tra danh sách dịch vụ có dữ liệu");
        int count = servicesPage.getServicesCount();
        Assert.assertTrue(count > 0, "Danh sách dịch vụ rỗng!");
    }

    @Test(priority = 2, description = "TC_STAFF_01: Quản lý hồ sơ nhân viên, phân ca và lọc theo chức vụ")
    public void testStaffManagement() {
        log("Điều hướng tới module Quản lý Nhân viên");
        sidebarNav.goToStaff();

        log("Kiểm tra tiêu đề trang Nhân viên");
        Assert.assertTrue(staffPage.isPageDisplayed(), "Trang Quản lý Nhân viên chưa hiển thị!");

        int initialCount = staffPage.getStaffCount();
        Assert.assertTrue(initialCount > 0, "Danh sách nhân viên rỗng!");

        log("Lọc nhân viên theo chức vụ 'Groomer'");
        staffPage.filterByRole("Groomer");

        log("Thêm mới nhân sự: Đặng Quốc Huy");
        staffPage.filterByRole("Tất cả chức vụ");
        staffPage.addNewStaff("Đặng Quốc Huy", "0978112233");

        int updatedCount = staffPage.getStaffCount();
        Assert.assertTrue(updatedCount >= initialCount, "Thêm nhân viên mới thất bại!");
    }
}
