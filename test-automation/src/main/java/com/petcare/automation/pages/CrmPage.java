package com.petcare.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class CrmPage extends BasePage {

    private final By pageTitle = By.xpath("//h1[contains(., 'CRM') or contains(., 'Chăm Sóc')]");
    private final By remindButtons = By.xpath("//button[contains(., 'Gửi Remind Zalo') or contains(., 'Đã Gửi SMS')]");

    public CrmPage(WebDriver driver) {
        super(driver);
    }

    public boolean isPageDisplayed() {
        return isElementDisplayed(pageTitle);
    }

    public void clickFirstReminder() {
        List<WebElement> buttons = findElements(remindButtons);
        if (!buttons.isEmpty() && buttons.get(0).isEnabled()) {
            buttons.get(0).click();
            sleep(400);
        }
    }
}
