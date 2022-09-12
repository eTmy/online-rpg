package com.etmy.onlinerpg.location;

import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
public abstract class Location {

    protected String name;
    protected String text;
    protected String srcImage;
    protected Set<String> actions = new HashSet<>();
    protected Set<String> locations = new HashSet<>();

    //public abstract void doAction(String action);
    //public abstract Location move(String locationName);

}
