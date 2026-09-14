package com.petcare.automation.tests;

import com.petcare.automation.base.BaseTest;
import com.petcare.automation.config.FrameworkConstants;
import com.petcare.automation.pages.LoginPage;
import com.petcare.automation.pages.ProductsPage;
import com.petcare.automation.pages.SidebarNav;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class ProductsInventoryTest extends BaseTest {

    private LoginPage loginPage;
    private SidebarNav sidebarNav;
    private ProductsPage productsPage;

    @BeforeMethod
    public void setupTest() {
        loginPage = new LoginPage(driver);
        sidebarNav = new SidebarNav(driver);
        productsPage = new ProductsPage(driver);
        driver.get(FrameworkConstants.APP_URL);

        if (loginPage.isLoginPageDisplayed()) {
            loginPage.clickQuickLoginAdmin();
        }
    }

    @Test(priority = 1, description = "TC_PROD_01: Tra cứu sản phẩm trong kho theo tên và danh mục")
    public void testSearchAndFilterProducts() {
        log("Điều hướng tới module Sản phẩm & Kho");
        sidebarNav.goToProducts();

        log("Kiểm tra tiêu đề trang Sản phẩm");
        Assert.assertTrue(productsPage.isPageDisplayed(), "Trang Quản lý Sản phẩm chưa hiển thị!");

        log("Tìm kiếm sản phẩm theo tên 'Pate'");
        productsPage.searchProduct("Pate");
        int count = productsPage.getProductsCount();
        Assert.assertTrue(count > 0, "Không tìm thấy sản phẩm chứa từ khóa 'Pate'!");

        log("Lọc theo danh mục 'Thức ăn'");
        productsPage.filterByCategory("Thức ăn");
    }
}
