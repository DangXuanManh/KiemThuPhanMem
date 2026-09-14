package com.petcare.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class CustomersPage extends BasePage {

    private final By pageTitle = By.xpath("//h1[contains(., 'Khách Hàng')]");
    private final By addCustomerBtn = By.xpath("//button[contains(., 'Thêm Khách Hàng')]");
    private final By searchInput = By.xpath("//input[@placeholder[contains(., 'Tìm theo tên') or contains(., 'Tìm kiếm')]]");
    private final By tierFilterSelect = By.xpath("//select[option[contains(text(), 'Tất cả hạng')]]");
    private final By customerRows = By.xpath("//table//tbody/tr");

    // Modal Add Customer
    private final By nameInput = By.xpath("//form//input[@type='text' and @required]");
    private final By phoneInput = By.xpath("//form//input[@placeholder[contains(., '09')]]");
    private final By emailInput = By.xpath("//form//input[@type='email']");
    private final By submitCustomerBtn = By.xpath("//form//button[@type='submit']");

    public CustomersPage(WebDriver driver) {
        super(driver);
    }

    public boolean isPageDisplayed() {
        return isElementDisplayed(pageTitle);
    }

    public void searchCustomer(String keyword) {
        sendKeys(searchInput, keyword);
        sleep(400);
    }

    public void filterByTier(String tier) {
        selectByVisibleText(tierFilterSelect, tier);
        sleep(400);
    }

    public void addNewCustomer(String name, String phone, String email) {
        click(addCustomerBtn);
        sleep(400);
        sendKeys(nameInput, name);
        sendKeys(phoneInput, phone);
        if (isElementPresent(emailInput)) {
            sendKeys(emailInput, email);
        }
        click(submitCustomerBtn);
        sleep(600);
    }

    public int getCustomerCount() {
        return findElements(customerRows).size();
    }
}
