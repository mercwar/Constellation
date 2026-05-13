# FILE: list.repos.q
# PATH: /Constellation/queries/list.repos.q

# ------------------------------------------------------------
# AVIS.HEADER
# ROLE: QUERY_DEFINITION
# PURPOSE: Returns all repos in the Mercwar Constellation
# AUTHOR: Demon
# NOTES: Sentinel + Nexus use this to enumerate repo universe
# ------------------------------------------------------------

[QUERY]
ACTION = LIST
TARGET = REPOS

[OUTPUT]
FORMAT = LINE_BY_LINE

[EXPECTED]
AVIS
CYBORG
FIRE-GEM
ROBO-KNIGHT
DARKSTAR
BROWSERX
SENTINEL
NEXUS
