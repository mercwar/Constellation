/* FILE: constellation_reduce.h */
/* PATH: /Constellation/constellation_reduce.h */

/* ------------------------------------------------------------
   AVIS.HEADER
   ROLE: CONSTELLATION_REDUCER_HEADER
   PURPOSE: Header for the Constellation reducer program. Defines
            prototypes and constants for bulk reduction, version
            detection, and future‑safe compilation logic.
   AUTHOR: Demon
   NOTES: This is the SECOND HEADER in the Constellation chain.
          All future Constellation reducers inherit from this.
   ------------------------------------------------------------ */

#ifndef CONSTELLATION_REDUCE_H
#define CONSTELLATION_REDUCE_H

#define MAX_PATH 1024
#define MAX_KEEP 32

/* ------------------------------------------------------------
   FUNCTION PROTOTYPES
   ------------------------------------------------------------ */

/* Determines if a file should be preserved */
int is_keep_file(const char *name);

/* Detects if a folder name represents a version */
int is_version_folder(const char *name);

/* Reduces a Constellation folder by removing bulk */
void reduce_constellation_folder(const char *path);

#endif /* CONSTELLATION_REDUCE_H */
