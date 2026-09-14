package com.petcare.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class StaffPage extends BasePage {

    private final By pageTitle = By.xpath("//h1[contains(., 'Nhân Viên')]");
    private final By addStaffBtn = By.xpath("//button[contains(., 'Thêm Nhân Viên')]");
    private final By roleFilterSelect = By.xpath("//select[option[contains(text(), 'Tất cả chức vụ')]]");
    private final By staffCards = By.xpath("//div[contains(@class, 'rounded-3xl') and contains(., 'Ca')]");

    // Modal Add Staff
    private final By nameInput = By.xpath("//form//input[@type='text' and @required]");
    private final By phoneInput = By.xpath("//form//input[@placeholder[contains(., '09')]]");
    private final By submitStaffBtn = By.xpath("//form//button[@type='submit']");

    public StaffPage(WebDriver driver) {
        super(driver);
    }

    public boolean isPageDisplayed() {
        return isElementDisplayed(pageTitle);
    }

    public void filterByRole(String role) {
        selectByVisibleText(roleFilterSelect, role);
        sleep(400);
    }

    public void addNewStaff(String name, String phone) {
        click(addStaffBtn);
        sleep(400);
        sendKeys(nameInput, name);
        sendKeys(phoneInput, phone);
        click(submitStaffBtn);
        sleep(600);
    }

    public int getStaffCount() {
        return findElements(staffCards).size();
    }
}
