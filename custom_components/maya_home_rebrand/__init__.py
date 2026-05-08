from __future__ import annotations

from pathlib import Path

from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import STATIC_URL_PATH


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Register static assets used by the global rebranding script."""
    static_dir = Path(__file__).parent / "static"

    # Use async registration (register_static_path is deprecated and removed in 2025.7)
    await hass.http.async_register_static_paths(
        [StaticPathConfig(STATIC_URL_PATH, str(static_dir), cache_headers=False)]
    )

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    # There is no supported way to unregister static paths; returning True is fine.
    return True

