/* FILE: constellation_linker.h */
/* PATH: /Constellation/constellation_linker.h */

/* ------------------------------------------------------------
   AVIS.HEADER
   ROLE: CONSTELLATION_LINKER_HEADER
   PURPOSE: Header for the Constellation Linker. Defines structs,
            constants, and prototypes used to merge compiled
            Constellation versions into a unified intelligence
            model.
   AUTHOR: Demon
   NOTES: This is the FOURTH HEADER in the Constellation chain.
          It completes the intelligence pipeline:
          scan → reduce → autobuild → link.
   ------------------------------------------------------------ */

#ifndef CONSTELLATION_LINKER_H
#define CONSTELLATION_LINKER_H

#define MAX_PATH 1024
#define MAX_BINARIES 256

/* ------------------------------------------------------------
   STRUCT: BinaryEntry
   PURPOSE: Represents a compiled version binary (*.bin)
   ------------------------------------------------------------ */
typedef struct {
    char path[MAX_PATH];
    char name[MAX_PATH];
} BinaryEntry;

/* ------------------------------------------------------------
   FUNCTION PROTOTYPES
   ------------------------------------------------------------ */

/* Detects if a file is a compiled Constellation binary */
int is_binary(const char *name);

/* Scans a Constellation folder for compiled binaries */
int scan_binaries(const char *path,
                  BinaryEntry bins[],
                  int *count);

/* Merges all binaries into a unified intelligence file */
void link_binaries(BinaryEntry bins[],
                   int count,
                   const char *output);

#endif /* CONSTELLATION_LINKER_H */
