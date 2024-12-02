package com.jiroscripts.reactnativedevicebrightness

import android.content.Context
import android.provider.Settings
import android.view.WindowManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class ReactNativeDeviceBrightnessModule internal constructor(context: ReactApplicationContext) :
  ReactNativeDeviceBrightnessSpec(context) {

  private val reactContext: ReactApplicationContext = context

  override fun getName(): String {
    return NAME
  }

  /**
   * Get the current system brightness level.
   * Brightness is returned as a float between 0.0 and 1.0.
   */
  fun getSystemBrightness(promise: Promise) {
    try {
      val brightness = Settings.System.getInt(
        reactApplicationContext.contentResolver,
        Settings.System.SCREEN_BRIGHTNESS
      )
      // Convert brightness level from 0-255 to 0.0-1.0
      promise.resolve(brightness / 255.0)
    } catch (e: Settings.SettingNotFoundException) {
      promise.reject("ERROR", "Unable to get brightness", e)
    }
  }

  /**
   * Get the brightness of the current activity, or fallback to system brightness if not explicitly set.
   * Brightness is returned as a float between 0.0 and 1.0.
   */
  override fun getBrightness(promise: Promise) {
    try {
      currentActivity?.runOnUiThread {
        val window = currentActivity?.window
        val brightness = window?.attributes?.screenBrightness

        if (brightness != null && brightness >= 0) {
          // If activity-specific brightness is set, return it (range: 0.0-1.0)
          promise.resolve(brightness.toDouble())
        } else {
          // If no activity-specific brightness is set, fallback to system-wide brightness
          getSystemBrightness(promise)
        }
      } ?: run {
        promise.reject("ERROR", "Activity is null")
      }
    } catch (e: Exception) {
      promise.reject("ERROR", "Unable to get brightness", e)
    }
  }

  /**
   * Set the brightness for the current activity.
   * Brightness should be a float between 0.0 and 1.0.
   */
  override fun setBrightness(brightness: Double, promise: Promise) {
    try {
      val brightnessValue = (brightness.coerceIn(0.0, 1.0) * 255).toInt()

      // Ensure that the brightness is set on the main thread
      currentActivity?.runOnUiThread {
        val window = currentActivity?.window
        val layoutParams = window?.attributes
        val newBrightness = brightnessValue / 255f // Convert to 0.0-1.0 range
        layoutParams?.screenBrightness = newBrightness
        window?.attributes = layoutParams

        promise.resolve(newBrightness)
      } ?: run {
        promise.reject("ERROR", "Activity is null")
      }
    } catch (e: Exception) {
      promise.reject("ERROR", "Unable to set brightness", e)
    }
  }

  /**
   * Reset the brightness for the current activity to the system default.
   */
  override fun resetBrightness(promise: Promise) {
    try {
      currentActivity?.runOnUiThread {
        val window = currentActivity?.window
        val layoutParams = window?.attributes
        layoutParams?.screenBrightness = WindowManager.LayoutParams.BRIGHTNESS_OVERRIDE_NONE
        window?.attributes = layoutParams

        getSystemBrightness(promise)
      } ?: run {
        promise.reject("ERROR", "Activity is null")
      }
    } catch (e: Exception) {
      promise.reject("ERROR", "Unable to reset brightness", e)
    }
  }

  companion object {
    const val NAME = "ReactNativeDeviceBrightness"
  }
}
