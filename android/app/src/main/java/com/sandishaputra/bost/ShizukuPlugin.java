package com.sandishaputra.bost;

import android.content.ComponentName;
import android.content.ServiceConnection;
import android.content.pm.PackageManager;
import android.os.IBinder;
import android.os.RemoteException;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import rikka.shizuku.Shizuku;
import com.sandishaputra.bost.BuildConfig;

@CapacitorPlugin(name = "ShizukuPlugin")
public class ShizukuPlugin extends Plugin {

    private static final int REQUEST_CODE = 1001;

    private PluginCall permissionCall;
    private IUserService userService;

    private final ServiceConnection serviceConnection = new ServiceConnection() {

        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            userService = IUserService.Stub.asInterface(service);
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
            userService = null;
        }
    };

    private final Shizuku.UserServiceArgs userServiceArgs =
            new Shizuku.UserServiceArgs(
                    new ComponentName(
                            BuildConfig.APPLICATION_ID,
                            UserService.class.getName()
                    )
            )
                    .daemon(false)
                    .processNameSuffix("service")
                    .debuggable(BuildConfig.DEBUG)
                    .version(BuildConfig.VERSION_CODE);

    private void bindService() {

        if (userService != null) {
            return;
        }

        Shizuku.bindUserService(
                userServiceArgs,
                serviceConnection
        );
    }
      @PluginMethod
    public void checkStatus(PluginCall call) {

        JSObject result = new JSObject();

        boolean available = Shizuku.pingBinder();
        boolean permission = false;

        if (available) {
            permission = Shizuku.checkSelfPermission()
                    == PackageManager.PERMISSION_GRANTED;

            if (permission) {
                bindService();
            }
        }

        result.put("available", available);
        result.put("permission", permission);

        call.resolve(result);
    }

    @PluginMethod
    public void requestPermission(PluginCall call) {

        if (!Shizuku.pingBinder()) {
            call.reject("Shizuku belum aktif");
            return;
        }

        if (Shizuku.checkSelfPermission()
                == PackageManager.PERMISSION_GRANTED) {

            bindService();

            JSObject result = new JSObject();
            result.put("granted", true);
            call.resolve(result);
            return;
        }

        permissionCall = call;

        Shizuku.OnRequestPermissionResultListener listener =
                new Shizuku.OnRequestPermissionResultListener() {

            @Override
            public void onRequestPermissionResult(
                    int requestCode,
                    int grantResult
            ) {

                if (requestCode != REQUEST_CODE) {
                    return;
                }

                Shizuku.removeRequestPermissionResultListener(this);

                JSObject result = new JSObject();

                boolean granted =
                        grantResult == PackageManager.PERMISSION_GRANTED;

                if (granted) {
                    bindService();
                }

                result.put("granted", granted);

                if (permissionCall != null) {
                    permissionCall.resolve(result);
                    permissionCall = null;
                }
            }
        };

        Shizuku.addRequestPermissionResultListener(listener);
        Shizuku.requestPermission(REQUEST_CODE);
    }
      @PluginMethod
    public void executeCommand(PluginCall call) {

        String command = call.getString("command");

        if (command == null || command.trim().isEmpty()) {
            call.reject("Command kosong");
            return;
        }

        if (!Shizuku.pingBinder()) {
            call.reject("Shizuku belum aktif");
            return;
        }

        if (Shizuku.checkSelfPermission()
                != PackageManager.PERMISSION_GRANTED) {
            call.reject("Permission Shizuku belum diberikan");
            return;
        }

        bindService();

        if (userService == null) {
            call.reject("UserService belum terhubung");
            return;
        }

        try {

            String output = userService.executeCommand(command);

            JSObject result = new JSObject();
            result.put("success", true);
            result.put("output", output);

            call.resolve(result);

        } catch (RemoteException e) {
            call.reject(e.getMessage());
        }
    }
      @Override
    protected void handleOnDestroy() {

        try {
            Shizuku.unbindUserService(
                    userServiceArgs,
                    serviceConnection,
                    true
            );
        } catch (Throwable ignored) {
        }

        userService = null;

        super.handleOnDestroy();
    }
}