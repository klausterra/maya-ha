from __future__ import annotations

from pathlib import Path

from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import DOMAIN, STATIC_URL_PATH


async def _async_register_static(hass: HomeAssistant) -> None:
    """Register our static assets path (idempotent-ish)."""
    # Avoid re-registering on reloads; the HTTP component doesn't provide an official unregister.
    if hass.data.get(f"{DOMAIN}_static_registered"):
        return

    static_dir = Path(__file__).parent / "static"
    await hass.http.async_register_static_paths(
        [StaticPathConfig(STATIC_URL_PATH, str(static_dir), cache_headers=False)]
    )
    hass.data[f"{DOMAIN}_static_registered"] = True


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Set up (so assets are available even if the config entry wasn't created yet)."""
    await _async_register_static(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Register static assets used by the global rebranding script."""
    await _async_register_static(hass)

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    # There is no supported way to unregister static paths; returning True is fine.
    return True

