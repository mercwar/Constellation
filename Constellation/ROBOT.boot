# FILE: ROBOT.boot
# PATH: /Constellation/ROBOT.boot

# ------------------------------------------------------------
# AVIS.HEADER
# ROLE: GLOBAL_ROBOT_BOOT
# PURPOSE: Defines global boot sequence for all robots
# AUTHOR: Demon
# NOTES: Sentinel loads this before anything else
# ------------------------------------------------------------

[BOOT]
LOAD_INDEX = /Constellation/CONSTELLATION.index
LOAD_SCHEMA = /Constellation/AVIS.schema
LOAD_DATALAKE = /Constellation/AVIS.datalake

[ROBOT-NOTES]
All robots: Boot from this file before executing any logic.
