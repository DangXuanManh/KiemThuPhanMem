package com.petcare.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class ProductsPage extends BasePage {

    private final By pageTitle = By.xpath("//h1[contains(., 'Kho Hàng') or contains(., 'Sản Phẩm')]");
    private final By searchInput = By.xpath("//input[@placeholder[contains(., 'Tìm theo tên') or contains(., 'Tìm')]]");
    private final By categorySelect = By.xpath("//select[option[contains(text(), 'Tất cả danh mục')]]");
    private final By productRows = By.xpath("//table//tbody/tr");

    public ProductsPage(WebDriver driver) {
        super(driver);
    }

    public boolean isPageDisplayed() {
        return isElementDisplayed(pageTitle);
    }

    public void searchProduct(String name) {
        sendKeys(searchInput, name);
        sleep(400);
    }

    public void filterByCategory(String category) {
        selectByVisibleText(categorySelect, category);
        sleep(400);
    }

    public int getProductsCount() {
        return findElements(productRows).size();
    }
}
