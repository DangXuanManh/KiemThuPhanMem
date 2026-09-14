package com.petcare.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class SidebarNav extends BasePage {

    // Menu items
    private final By dashboardTab = By.xpath("//aside//button[contains(., 'Tổng quan')] | //button[contains(., 'Tổng quan')]");
    private final By appointmentsTab = By.xpath("//aside//button[contains(., 'Lịch hẹn')] | //button[contains(., 'Lịch hẹn')]");
    private final By ordersTab = By.xpath("//aside//button[contains(., 'Bán hàng')] | //button[contains(., 'Bán hàng')]");
    private final By customersTab = By.xpath("//aside//button[contains(., 'Khách hàng')] | //button[contains(., 'Khách hàng')]");
    private final By petsTab = By.xpath("//aside//button[contains(., 'Thú cưng')] | //button[contains(., 'Thú cưng')]");
    private final By productsTab = By.xpath("//aside//button[contains(., 'Sản phẩm')] | //button[contains(., 'Sản phẩm')]");
    private final By servicesTab = By.xpath("//aside//button[contains(., 'Quản lý Dịch vụ')] | //button[contains(., 'Dịch vụ')]");
    private final By staffTab = By.xpath("//aside//button[contains(., 'Quản lý Nhân viên')] | //button[contains(., 'Nhân viên')]");
    private final By promotionsTab = By.xpath("//aside//button[contains(., 'Quản lý Voucher')] | //button[contains(., 'Voucher')]");
    private final By crmTab = By.xpath("//aside//button[contains(., 'CRM')] | //button[contains(., 'CRM')]");
    private final By reportsTab = By.xpath("//aside//button[contains(., 'Báo cáo')] | //button[contains(., 'Báo cáo')]");
    private final By settingsTab = By.xpath("//aside//button[contains(., 'Cấu hình')] | //button[contains(., 'Cấu hình')]");

    // Header & User badge
    private final By currentRoleBadge = By.xpath("//header//span[contains(text(), 'Quản Trị')] | //header//span[contains(text(), 'Nhân Viên')] | //span[contains(text(), 'Admin')]");
    private final By userMenuBtn = By.xpath("//header//button[.//div[contains(@class, 'bg-slate-900')]] | //header//button[contains(@class, 'rounded-2xl')]");
    private final By logoutBtn = By.xpath("//button[contains(., 'Đăng xuất')]");
    private final By switchRoleBtn = By.xpath("//button[contains(., 'Chuyển sang')]");
    private final By restrictedNotice = By.xpath("//div[contains(., 'Yêu Cầu Quyền Quản Trị Viên') or contains(., 'Hạn chế truy cập')] | //h2[contains(., 'Hạn chế')]");

    public SidebarNav(WebDriver driver) {
        super(driver);
    }

    public void goToDashboard() { click(dashboardTab); sleep(300); }
    public void goToAppointments() { click(appointmentsTab); sleep(300); }
    public void goToOrders() { click(ordersTab); sleep(300); }
    public void goToCustomers() { click(customersTab); sleep(300); }
    public void goToPets() { click(petsTab); sleep(300); }
    public void goToProducts() { click(productsTab); sleep(300); }
    public void goToServices() { click(servicesTab); sleep(300); }
    public void goToStaff() { click(staffTab); sleep(300); }
    public void goToPromotions() { click(promotionsTab); sleep(300); }
    public void goToCrm() { click(crmTab); sleep(300); }
    public void goToReports() { click(reportsTab); sleep(300); }
    public void goToSettings() { click(settingsTab); sleep(300); }

    public boolean isRestrictedNoticeDisplayed() {
        return isElementDisplayed(restrictedNotice);
    }

    public String getCurrentRoleText() {
        if (isElementDisplayed(currentRoleBadge)) {
            return getText(currentRoleBadge);
        }
        return "";
    }

    public void logout() {
        if (isElementPresent(userMenuBtn)) {
            click(userMenuBtn);
            sleep(400);
            if (isElementPresent(logoutBtn)) {
                click(logoutBtn);
                sleep(600);
            }
        }
    }

    public void switchRole() {
        if (isElementPresent(userMenuBtn)) {
            click(userMenuBtn);
            sleep(400);
            if (isElementPresent(switchRoleBtn)) {
                click(switchRoleBtn);
                sleep(500);
            }
        }
    }
}
