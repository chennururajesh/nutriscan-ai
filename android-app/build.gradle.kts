// Top-level build file for NutriScan AI Android Application
plugins {
    id("com.android.application") version "8.3.2" apply false
}

tasks.register("clean", Delete::class) {
    delete(rootProject.layout.buildDirectory)
}
