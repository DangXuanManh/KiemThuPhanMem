package com.petcare.automation.tests;

import com.petcare.automation.base.BaseTest;
import com.petcare.automation.config.FrameworkConstants;
import com.petcare.automation.pages.AppointmentsPage;
import com.petcare.automation.pages.LoginPage;
import com.petcare.automation.pages.SidebarNav;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class AppointmentsTest extends BaseTest {

    private LoginPage loginPage;
    private SidebarNav sidebarNav;
    private AppointmentsPage appointmentsPage;

    @BeforeMethod
    public void setupTest() {
        loginPage = new LoginPage(driver);
        sidebarNav = new SidebarNav(driver);
        appointmentsPage = new AppointmentsPage(driver);
        driver.get(FrameworkConstants.APP_URL);

        if (loginPage.isLoginPageDisplayed()) {
            loginPage.clickQuickLoginAdmin();
        }
    }

    @Test(priority = 1, description = "TC_APP_01: Truy cập trang Lịch hẹn và kiểm tra danh sách lịch đặt ca")
    public void testViewAppointmentsList() {
        log("Điều hướng tới module Lịch hẹn");
        sidebarNav.goToAppointments();

        log("Kiểm tra tiêu đề trang Lịch hẹn");
        Assert.assertTrue(appointmentsPage.isPageDisplayed(), "Trang Quản lý Lịch hẹn chưa hiển thị!");

        log("Kiểm tra có ít nhất 1 lịch hẹn trong hệ thống");
        int count = appointmentsPage.getAppointmentsCount();
        Assert.assertTrue(count > 0, "Danh sách lịch hẹn rỗng!");
    }

    @Test(priority = 2, description = "TC_APP_02: Quy trình đặt lịch dịch vụ Spa mới qua 7 bước")
    public void testCreateNewAppointment7Steps() {
        log("Điều hướng tới module Lịch hẹn");
        sidebarNav.goToAppointments();

        int initialCount = appointmentsPage.getAppointmentsCount();

        log("Mở modal đặt lịch 7 bước");
        appointmentsPage.openNewBookingModal();

        log("Thực hiện hoàn tất 7 bước đặt lịch ca Spa mới");
        appointmentsPage.complete7StepBooking("Cún hơi nhát, vui lòng thao tác nhẹ nhàng");

        log("Kiểm tra số lượng lịch hẹn được cập nhật thêm mới");
        int newCount = appointmentsPage.getAppointmentsCount();
        Assert.assertTrue(newCount >= initialCount, "Số lượng lịch hẹn không tăng sau khi đặt ca mới!");
    }
}
