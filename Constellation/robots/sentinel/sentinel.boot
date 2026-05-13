# FILE: sentinel.boot
# PATH: /Constellation/robots/sentinel/sentinel.boot

# ------------------------------------------------------------
# AVIS.HEADER
# ROLE: SENTINEL_BOOT_SEQUENCE
# PURPOSE: Boot logic for Sentinel navigation robot
# AUTHOR: Demon
# NOTES: Loads maps, initializes graph, prepares scan cycle
# ------------------------------------------------------------

[BOOT]
LOAD_MAP = /Constellation/maps/MERCWAR.CONSTELLATION.AVIS
LOAD_RULES = /Constellation/maps/ROBOT.SELFSEARCH.AVIS
LOAD_AUTOSCAN = /Constellation/maps/ROBOT.AUTOSCAN.AVIS

[INIT]
GRAPH = BUILD_FROM_MAP
MEMORY = INIT_GRAPH_MEMORY
STATE = READY

[ROBOT-NOTES]
Sentinel: Begin scan cycle after boot completes.
