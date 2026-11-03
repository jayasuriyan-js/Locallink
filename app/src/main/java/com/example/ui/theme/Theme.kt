package com.example.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = ElectricIndigoLight,
    onPrimary = Color.White,
    primaryContainer = ElectricIndigoContainerDark,
    onPrimaryContainer = Color(0xFFC7D2FE),
    secondary = VibrantCoralLight,
    onSecondary = Color.White,
    secondaryContainer = VibrantCoralContainerDark,
    onSecondaryContainer = Color(0xFFFFD1D9),
    tertiary = EmeraldSuccess,
    background = ObsidianBackground,
    onBackground = SilverGreyTextPrimary,
    surface = ObsidianSurface,
    onSurface = SilverGreyTextPrimary,
    surfaceVariant = ObsidianSurfaceVariant,
    onSurfaceVariant = SilverGreyTextSecondary,
    outline = DarkGlowingBorder,
    outlineVariant = Color(0xFF1F2338)
)

private val LightColorScheme = lightColorScheme(
    primary = ElectricIndigoDark,
    onPrimary = Color.White,
    primaryContainer = ElectricIndigoContainerLight,
    onPrimaryContainer = ElectricIndigoDark,
    secondary = VibrantCoral,
    onSecondary = Color.White,
    secondaryContainer = VibrantCoralContainerLight,
    onSecondaryContainer = VibrantCoralDark,
    tertiary = EmeraldSuccessDark,
    background = PearlWhiteBackground,
    onBackground = CharcoalTextPrimary,
    surface = PearlWhiteSurface,
    onSurface = CharcoalTextPrimary,
    surfaceVariant = PearlWhiteSurfaceVariant,
    onSurfaceVariant = CharcoalTextSecondary,
    outline = LightBorder,
    outlineVariant = Color(0xFFCBD5E1)
)

@Composable
fun LocalLinkTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
