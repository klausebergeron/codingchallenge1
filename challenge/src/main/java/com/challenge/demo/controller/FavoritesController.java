package com.challenge.demo.controller;

import java.io.File;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.challenge.demo.service.FavoritesService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/")
public class FavoritesController {

    FavoritesService favoritesService = new FavoritesService(new File("challenge/src/main/favorites.txt"));
    public static final String FAVORITES = "/favorites";

    @GetMapping(path = FAVORITES)
	public ResponseEntity<?> get() {
        List<String> favList = favoritesService.getFavorites();
        if(favList.size() > 0) {
            return new ResponseEntity<>(favList, HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
	}

    @PostMapping(path = FAVORITES)
    public ResponseEntity<?> post(@RequestBody String fav) {
        List<String> favList = favoritesService.addFavorite(fav);
        return ResponseEntity.ok(favList);
    }

    @DeleteMapping(path = FAVORITES)
    public ResponseEntity<?> delete(@RequestBody String fav) {
        List<String> favList = favoritesService.deleteFavorite(fav);
        return ResponseEntity.ok(favList.toArray());
    }

}
