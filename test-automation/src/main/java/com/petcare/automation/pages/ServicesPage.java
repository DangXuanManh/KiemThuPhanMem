package com.petcare.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class ServicesPage extends BasePage {

    private final By pageTitle = By.xpath("//h1[contains(., 'Dịch Vụ')]");
    private final By serviceCards = By.xpath("//div[contains(@class, 'rounded-3xl') and contains(., 'đ')]");

    public ServicesPage(WebDriver driver) {
        super(driver);
    }

    public boolean isPageDisplayed() {
        return isElementDisplayed(pageTitle);
    }

    public int getServicesCount() {
        return findElements(serviceCards).size();
    }
}
