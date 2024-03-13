package com.challenge.demo.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class FavoritesService {

    File favorites;

    public FavoritesService(File favorites) {
        this.favorites = favorites;
    }

    public List<String> getFavorites() {
        List<String> favList = new ArrayList<>();
        try (BufferedReader buffReader = new BufferedReader(new FileReader(favorites))) {
            String line;
            while((line = buffReader.readLine()) != null) {
                    favList.add(line);
            }
            buffReader.close();
            updateFile(favList);
        } catch(FileNotFoundException e) {
            log.error("IO exception", e);
        } catch (IOException e) {
            log.error("IO exception", e);
        }
        return favList;
    }

    public void updateFile(List<String> newList) {
        try(PrintWriter writer = new PrintWriter(favorites)) {
            for(String f : newList) {
                writer.println(f);
            }
            writer.flush();
            writer.close();
        } catch (FileNotFoundException e) {
            log.error("FileNotFoundException", e);
        } catch (Exception e) {
            log.error("Exception", e);
        }
    }


    public List<String> addFavorite(String favorite) {
        List<String> favList = new ArrayList<>();
        favList = getFavorites();
        if(!favList.contains(favorite)) favList.add(favorite);
        updateFile(favList);        
        return favList;
    }

    public List<String> deleteFavorite(String favorite) {
        List<String> favList = new ArrayList<>();
        favList = getFavorites();
        for(int i = 0; i < favList.size(); i++) {
            if(favList.get(i).replace("\"", "").equals(favorite.replace("\"", ""))) {
                favList.remove(i);
            }
        }
        updateFile(favList);        
        return favList;
    }
}
