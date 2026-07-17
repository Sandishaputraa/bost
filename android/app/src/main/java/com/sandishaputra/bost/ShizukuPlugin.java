package com.sandishaputra.bost;

import android.content.pm.PackageManager;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import moe.shizuku.api.Shizuku;
import java.io.BufferedReader;
import java.io.InputStreamReader;

@CapacitorPlugin(name = "ShizukuPlugin")
public class ShizukuPlugin extends Plugin {

    @PluginMethod
    public void checkStatus(PluginCall call) {
        JSObject ret = new JSObject();
        boolean isAvailable = false;
        try {
            isAvailable = Shizuku.pingBinder();
        } catch (Throwable t) {
            isAvailable = false;
        }

        boolean hasPermission = false;
        if (isAvailable) {
            try {
                hasPermission = Shizuku.checkPermission();
            } catch (Throwable t) {
                hasPermission = false;
            }
        }

        ret.put("available", isAvailable);
        ret.put("permission", hasPermission);
        call.resolve(ret);
    }

    @PluginMethod
    public void requestPermission(PluginCall call) {
        if (Shizuku.pingBinder()) {
            Shizuku.addRequestPermissionResultListener(new Shizuku.OnRequestPermissionResultListener() {
                @Override
                public void onRequestPermissionResult(int requestCode, int grantResult) {
                    JSObject ret = new JSObject();
                    ret.put("granted", grantResult == PackageManager.PERMISSION_GRANTED);
                    call.resolve(ret);
                    Shizuku.removeRequestPermissionResultListener(this);
                }
            });
            Shizuku.requestPermission(1001);
        } else {
            call.reject("Shizuku belum aktif.");
        }
    }

    @PluginMethod
    public void executeCommand(PluginCall call) {
        String command = call.getString("command");
        if (command == null) {
            call.reject("Command tidak boleh kosong.");
            return;
        }

        if (!Shizuku.pingBinder()) {
            call.reject("Shizuku belum aktif.");
            return;
        }

        try {
            // Menjalankan shell command resmi via Shizuku tanpa root
            Process process = Shizuku.newProcess(new String[]{"sh", "-c", command}, null, null);
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
            
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
            
            StringBuilder error = new StringBuilder();
            while ((line = errorReader.readLine()) != null) {
                error.append(line).append("\n");
            }

            int exitCode = process.waitFor();
            JSObject ret = new JSObject();
            ret.put("exitCode", exitCode);
            ret.put("output", output.toString().trim());
            ret.put("error", error.toString().trim());
            
            if (exitCode == 0) {
                call.resolve(ret);
            } else {
                call.reject(error.toString().trim(), String.valueOf(exitCode), ret);
            }
        } catch (Exception e) {
            call.reject("Eksekusi gagal: " + e.getMessage());
        }
    }
}