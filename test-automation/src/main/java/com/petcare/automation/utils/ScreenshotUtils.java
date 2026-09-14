package com.petcare.automation.utils;

import com.petcare.automation.config.FrameworkConstants;
import org.apache.commons.io.FileUtils;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class ScreenshotUtils {

    public static String captureScreenshotAsBase64(WebDriver driver) {
        if (driver == null) return "";
        TakesScreenshot ts = (TakesScreenshot) driver;
        return ts.getScreenshotAs(OutputType.BASE64);
    }

    public static String captureScreenshotAsFile(WebDriver driver, String screenshotName) {
        if (driver == null) return "";
        try {
            TakesScreenshot ts = (TakesScreenshot) driver;
            File source = ts.getScreenshotAs(OutputType.FILE);
            String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
            String fileName = screenshotName.replaceAll("[^a-zA-Z0-9.-]", "_") + "_" + timestamp + ".png";
            String destPath = FrameworkConstants.SCREENSHOTS_DIR + "/" + fileName;
            File destination = new File(destPath);
            FileUtils.copyFile(source, destination);
            return destPath;
        } catch (IOException e) {
            System.err.println("Lỗi khi lưu ảnh chụp màn hình: " + e.getMessage());
            return "";
        }
    }
}
