package com.petcare.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class AppointmentsPage extends BasePage {

    private final By pageTitle = By.xpath("//h1[contains(., 'Lịch Hẹn')]");
    private final By newBookingBtn = By.xpath("//main//button[contains(., 'Đặt Lịch Hẹn Mới')] | //button[contains(@class, 'rounded-2xl') and contains(., 'Đặt Lịch Hẹn Mới')]");
    private final By appointmentRows = By.xpath("//table//tbody/tr");
    private final By notesInput = By.xpath("//textarea");

    public AppointmentsPage(WebDriver driver) {
        super(driver);
    }

    public boolean isPageDisplayed() {
        return isElementDisplayed(pageTitle);
    }

    public void openNewBookingModal() {
        click(newBookingBtn);
        sleep(600);
    }

    public void complete7StepBooking(String notes) {
        // Step 1: Select Customer
        List<WebElement> customers = findElements(By.name("customer"));
        if (!customers.isEmpty()) {
            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", customers.get(0));
        }
        sleep(400);

        int maxIterations = 10;
        while (maxIterations > 0) {
            // If in pet step, select pet
            List<WebElement> pets = findElements(By.name("pet"));
            if (!pets.isEmpty()) {
                ((JavascriptExecutor) driver).executeScript("arguments[0].click();", pets.get(0));
            }

            // If in service step, select service
            List<WebElement> services = findElements(By.name("service"));
            if (!services.isEmpty()) {
                ((JavascriptExecutor) driver).executeScript("arguments[0].click();", services.get(0));
            }

            // If in staff step, select staff
            List<WebElement> staff = findElements(By.name("staff"));
            if (!staff.isEmpty()) {
                ((JavascriptExecutor) driver).executeScript("arguments[0].click();", staff.get(0));
            }

            // If notes input present and visible
            if (isElementPresent(notesInput)) {
                try {
                    WebElement notesElem = driver.findElement(notesInput);
                    if (notesElem.isDisplayed()) {
                        notesElem.clear();
                        notesElem.sendKeys(notes);
                    }
                } catch (Exception ignored) {}
            }

            // Check if final submit button is present and visible
            List<WebElement> submitBtns = findElements(By.xpath("//form//button[contains(., 'Xác Nhận') or @type='submit']"));
            if (!submitBtns.isEmpty() && submitBtns.get(0).isDisplayed()) {
                ((JavascriptExecutor) driver).executeScript("arguments[0].click();", submitBtns.get(0));
                sleep(1000);
                break;
            }

            // Otherwise click Next button
            List<WebElement> nextBtns = findElements(By.xpath("//form//button[contains(., 'Tiếp') or contains(@class, 'bg-emerald-500')]"));
            if (!nextBtns.isEmpty() && nextBtns.get(0).isDisplayed()) {
                ((JavascriptExecutor) driver).executeScript("arguments[0].click();", nextBtns.get(0));
                sleep(400);
            }

            maxIterations--;
        }
    }

    public int getAppointmentsCount() {
        return findElements(appointmentRows).size();
    }
}
