# FILE: protocol.avs
# PATH: /Constellation/robots/shared/protocol/protocol.avs

# ------------------------------------------------------------
# AVIS.HEADER
# ROLE: ROBOT_PROTOCOL
# PURPOSE: Defines communication protocol between robots + datalake
# AUTHOR: Demon
# NOTES: Core law for robot-to-datalake interaction
# ------------------------------------------------------------

[PROTOCOL]
HANDSHAKE = AVIS-1.0
UNIT-FORMAT = NORMALIZED
MODEL-FORMAT = STACKABLE
GRAPH-FORMAT = NAVIGABLE

[ROBOT-NOTES]
All robots: Follow protocol strictly to avoid corruption.
