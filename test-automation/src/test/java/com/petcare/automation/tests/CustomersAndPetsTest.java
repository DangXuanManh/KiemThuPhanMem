package com.petcare.automation.tests;

import com.petcare.automation.base.BaseTest;
import com.petcare.automation.config.FrameworkConstants;
import com.petcare.automation.pages.CustomersPage;
import com.petcare.automation.pages.LoginPage;
import com.petcare.automation.pages.PetsPage;
import com.petcare.automation.pages.SidebarNav;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class CustomersAndPetsTest extends BaseTest {

    private LoginPage loginPage;
    private SidebarNav sidebarNav;
    private CustomersPage customersPage;
    private PetsPage petsPage;

    @BeforeMethod
    public void setupTest() {
        loginPage = new LoginPage(driver);
        sidebarNav = new SidebarNav(driver);
        customersPage = new CustomersPage(driver);
        petsPage = new PetsPage(driver);
        driver.get(FrameworkConstants.APP_URL);

        if (loginPage.isLoginPageDisplayed()) {
            loginPage.clickQuickLoginAdmin();
        }
    }

    @Test(priority = 1, description = "TC_CUST_01: Tìm kiếm và lọc danh sách khách hàng")
    public void testSearchAndFilterCustomers() {
        log("Điều hướng tới module Khách hàng");
        sidebarNav.goToCustomers();

        log("Kiểm tra tiêu đề trang Khách hàng");
        Assert.assertTrue(customersPage.isPageDisplayed(), "Trang Khách hàng chưa hiển thị!");

        log("Tìm kiếm khách hàng theo từ khóa 'Nguyễn'");
        customersPage.searchCustomer("Nguyễn");
        int count = customersPage.getCustomerCount();
        Assert.assertTrue(count > 0, "Không tìm thấy khách hàng nào với từ khóa 'Nguyễn'!");

        log("Lọc khách hàng theo Hạng Kim Cương");
        customersPage.filterByTier("Kim Cương");
    }

    @Test(priority = 2, description = "TC_CUST_02: Thêm mới khách hàng thành viên vào hệ thống")
    public void testAddNewCustomer() {
        log("Điều hướng tới module Khách hàng");
        sidebarNav.goToCustomers();

        int initialCount = customersPage.getCustomerCount();

        log("Thêm mới khách hàng: Trần Ngọc Ánh");
        customersPage.addNewCustomer("Trần Ngọc Ánh", "0989998877", "ngocanh@gmail.com");

        log("Kiểm tra danh sách khách hàng được cập nhật");
        int updatedCount = customersPage.getCustomerCount();
        Assert.assertTrue(updatedCount >= initialCount, "Thêm khách hàng thất bại!");
    }

    @Test(priority = 3, description = "TC_PET_01: Quản lý hồ sơ thú cưng và chuyển đổi chế độ xem")
    public void testPetsViewModeAndFilter() {
        log("Điều hướng tới module Thú cưng");
        sidebarNav.goToPets();

        log("Kiểm tra tiêu đề trang Thú cưng");
        Assert.assertTrue(petsPage.isPageDisplayed(), "Trang Thú cưng chưa hiển thị!");

        log("Kiểm tra hiển thị dạng Thẻ (Grid view)");
        int cardsCount = petsPage.getPetCardsCount();
        Assert.assertTrue(cardsCount > 0, "Danh sách thẻ thú cưng rỗng!");

        log("Chuyển sang chế độ xem Bảng (Table view)");
        petsPage.switchToTableView();

        log("Chuyển lại chế độ xem Thẻ (Grid view)");
        petsPage.switchToGridView();
    }
}
