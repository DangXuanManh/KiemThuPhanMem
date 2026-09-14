package com.petcare.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class DashboardPage extends BasePage {

    private final By pageTitle = By.xpath("//h1[contains(., 'Tổng Quan') or contains(., 'PetCare')]");
    private final By timelineTable = By.xpath("//table//tbody/tr");

    public DashboardPage(WebDriver driver) {
        super(driver);
    }

    public boolean isPageDisplayed() {
        return isElementDisplayed(pageTitle);
    }

    public int getTimelineAppointmentsCount() {
        return findElements(timelineTable).size();
    }
}
