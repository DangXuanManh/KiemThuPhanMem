package com.petcare.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class LoginPage extends BasePage {

    private final By quickAdminBtn = By.xpath("//button[contains(., 'Admin')]");
    private final By quickStaffBtn = By.xpath("//button[contains(., 'Nhân Viên')]");
    private final By roleSelect = By.xpath("//form//select");
    private final By emailInput = By.xpath("//input[@type='email']");
    private final By passwordInput = By.xpath("//input[@type='password']");
    private final By submitBtn = By.xpath("//button[@type='submit']");
    private final By errorMessage = By.xpath("//div[contains(@class, 'bg-rose-500')]");
    private final By brandHeader = By.xpath("//h1[contains(., 'PetCare Pro')]");

    public LoginPage(WebDriver driver) {
        super(driver);
    }

    public boolean isLoginPageDisplayed() {
        return isElementDisplayed(brandHeader);
    }

    public void clickQuickLoginAdmin() {
        click(quickAdminBtn);
        sleep(500);
    }

    public void clickQuickLoginStaff() {
        click(quickStaffBtn);
        sleep(500);
    }

    public void loginWithForm(String role, String email, String password) {
        selectByValue(roleSelect, role);
        sendKeys(emailInput, email);
        sendKeys(passwordInput, password);
        click(submitBtn);
        sleep(500);
    }

    public String getErrorMessage() {
        return getText(errorMessage);
    }

    public boolean isErrorMessageDisplayed() {
        return isElementDisplayed(errorMessage);
    }
}
