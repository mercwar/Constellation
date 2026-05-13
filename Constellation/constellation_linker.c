/* FILE: constellation_linker.c */
/* PATH: /Constellation/constellation_linker.c */

/* ------------------------------------------------------------
   AVIS.HEADER
   ROLE: CONSTELLATION_LINKER
   PURPOSE: Links all compiled Constellation versions into a
            unified intelligence model. Merges metadata, version
            trees, and compiled binaries into a single artifact.
   AUTHOR: Demon
   NOTES: This is the FOURTH CONSTELLATION PROGRAM. It completes
          the intelligence pipeline:
          scan → reduce → autobuild → link.
   ------------------------------------------------------------ */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <dirent.h>

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
   FUNCTION: is_binary
   PURPOSE: Detects if a file is a compiled Constellation binary
   ------------------------------------------------------------ */
int is_binary(const char *name) {
    return strstr(name, ".bin") != NULL;
}

/* ------------------------------------------------------------
   FUNCTION: scan_binaries
   PURPOSE: Scans a Constellation folder for compiled binaries
   ------------------------------------------------------------ */
int scan_binaries(const char *path, BinaryEntry bins[], int *count) {
    DIR *dir = opendir(path);
    if (!dir) {
        printf("No Constellation folder found: %s\n", path);
        return 0;
    }

    struct dirent *entry;
    char fullPath[MAX_PATH];

    while ((entry = readdir(dir)) != NULL) {

        if (strcmp(entry->d_name, ".") == 0 ||
            strcmp(entry->d_name, "..") == 0)
            continue;

        if (entry->d_type == DT_REG && is_binary(entry->d_name)) {
            snprintf(fullPath, sizeof(fullPath), "%s/%s", path, entry->d_name);
            strcpy(bins[*count].path, fullPath);
            strcpy(bins[*count].name, entry->d_name);
            (*count)++;
        }
    }

    closedir(dir);
    return 1;
}

/* ------------------------------------------------------------
   FUNCTION: link_binaries
   PURPOSE: Merges all binaries into a unified intelligence file
   ------------------------------------------------------------ */
void link_binaries(BinaryEntry bins[], int count, const char *output) {
    FILE *out = fopen(output, "wb");
    if (!out) {
        printf("Failed to create output file: %s\n", output);
        return;
    }

    printf("Linking %d binaries into: %s\n", count, output);

    for (int i = 0; i < count; i++) {
        FILE *in = fopen(bins[i].path, "rb");
        if (!in) continue;

        printf(" - Merging: %s\n", bins[i].name);

        char buffer[4096];
        size_t bytes;

        while ((bytes = fread(buffer, 1, sizeof(buffer), in)) > 0) {
            fwrite(buffer, 1, bytes, out);
        }

        fclose(in);
    }

    fclose(out);
    printf("Linking complete.\n");
}

/* ------------------------------------------------------------
   MAIN PROGRAM
   PURPOSE: Entry point for the Constellation Linker
   ------------------------------------------------------------ */
int main(int argc, char *argv[]) {

    if (argc < 2) {
        printf("Usage: constellation_linker <repo-path>\n");
        return 1;
    }

    char constellationPath[MAX_PATH];
    snprintf(constellationPath, sizeof(constellationPath),
             "%s/Constellation", argv[1]);

    BinaryEntry bins[MAX_BINARIES];
    int count = 0;

    if (!scan_binaries(constellationPath, bins, &count)) {
        printf("No binaries found.\n");
        return 0;
    }

    char output[MAX_PATH];
    snprintf(output, sizeof(output), "%s/Constellation/intelligence.model",
             argv[1]);

    link_binaries(bins, count, output);

    printf("Unified intelligence model created.\n");
    return 0;
}
