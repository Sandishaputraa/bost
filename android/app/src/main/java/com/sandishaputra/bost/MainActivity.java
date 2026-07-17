package com.sandishaputra.bost;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(ShizukuPlugin.class); // Daftarkan plugin Shizuku
        super.onCreate(savedInstanceState);
    }
}